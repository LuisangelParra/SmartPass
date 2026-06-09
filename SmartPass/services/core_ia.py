import base64
import io
import numpy as np
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener
import face_recognition
import cv2

register_heif_opener()

def extract_embedding(image_bytes: bytes) -> list[float]:
    """
    Receives raw bytes of an uploaded image, processes it in memory,
    and extracts the 128-dimensional facial embedding vector.

    Raises ValueError if zero or multiple faces are detected.
    """
    image_stream = io.BytesIO(image_bytes)
    pil_image = Image.open(image_stream)

    # Honor EXIF orientation (iPhone photos are often physically rotated)
    pil_image = ImageOps.exif_transpose(pil_image)
    pil_image = pil_image.convert("RGB")

    # Resize large images so HOG detector runs in reasonable time
    max_dim = 1600
    if max(pil_image.size) > max_dim:
        pil_image.thumbnail((max_dim, max_dim))

    image_matrix = np.array(pil_image)

    # Try HOG detector with progressive upsampling for small / angled faces
    locations = []
    for upsample in (1, 2):
        locations = face_recognition.face_locations(
            image_matrix, number_of_times_to_upsample=upsample, model="hog"
        )
        if locations:
            break

    if len(locations) == 0:
        raise ValueError(
            "No face detected. Try a brighter, front-facing photo with the face clearly visible "
            "(at least 200 pixels wide)."
        )

    if len(locations) > 1:
        raise ValueError(
            "Multiple faces detected. Please upload an individual photo containing only one person."
        )

    face_encodings = face_recognition.face_encodings(
        image_matrix, known_face_locations=locations
    )
    return face_encodings[0].tolist()


def decode_base64_frame(base64_string: str) -> np.ndarray:
    """
    Takes a base64 encoded image string sent from the frontend webcam stream,
    cleans the metadata header if present, and decodes it into a NumPy array (OpenCV image).
    """
    # 1. Check and strip the data URI prefix if the frontend sends it
    # Example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABA..." -> "/9j/4AAQSkZJRgABA..."
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
        
    # 2. Decode the base64 string back into raw image bytes
    decoded_bytes = base64.b64decode(base64_string)
    
    # 3. Convert bytes into a 1D NumPy array of unsigned 8-bit integers
    np_buffer = np.frombuffer(decoded_bytes, dtype=np.uint8)
    
    # 4. Decode the memory buffer into a 3D image matrix (BGR format by default in OpenCV)
    bgr_frame = cv2.imdecode(np_buffer, cv2.IMREAD_COLOR)
    
    if bgr_frame is None:
        raise ValueError("Could not decode base64 string into a valid image frame.")
        
    return bgr_frame


def extract_frame_embedding_for_checkin(bgr_frame: np.ndarray) -> list[float]:
    """
    Processes a single frame captured from the webcam during the check-in process.
    Converts the frame from BGR (OpenCV) to RGB (Face Recognition) and extracts the embedding.
    
    Returns an empty list if no face is visible in the current frame.
    """
    rgb_frame = cv2.cvtColor(bgr_frame, cv2.COLOR_BGR2RGB)

    # Progressive upsampling — handles partial / smaller faces in webcam frames
    locations = []
    for upsample in (1, 2):
        locations = face_recognition.face_locations(
            rgb_frame, number_of_times_to_upsample=upsample, model="hog"
        )
        if locations:
            break

    if not locations:
        return []

    face_encodings = face_recognition.face_encodings(rgb_frame, known_face_locations=locations)
    return face_encodings[0].tolist()
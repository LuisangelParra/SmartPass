import base64
import io
import numpy as np
from PIL import Image
import face_recognition
import cv2

def extract_embedding(image_bytes: bytes) -> list[float]:
    """
    Receives raw bytes of an uploaded image, processes it in memory,
    and extracts the 128-dimensional facial embedding vector.
    
    Raises ValueError if zero or multiple faces are detected.
    """
    # 1. Convert raw bytes into an in-memory stream
    image_stream = io.BytesIO(image_bytes)
    
    # 2. Open the image using Pillow and force convert it to RGB format
    # (Essential because face_recognition library operates on RGB matrices)
    pil_image = Image.open(image_stream).convert("RGB")
    
    # 3. Convert the Pillow image into a NumPy array format
    image_matrix = np.array(pil_image)
    
    # 4. Detect face locations and generate face encodings
    face_encodings = face_recognition.face_encodings(image_matrix)
    
    # 5. Strict validation for registration purposes
    if len(face_encodings) == 0:
        raise ValueError("No face detected in the image. Please upload a clear photo of a single person.")
    
    if len(face_encodings) > 1:
        raise ValueError("Multiple faces detected. Please upload an individual photo containing only one person.")
        
    # 6. Extract the 128-dimensional array from the first face and convert it to a standard Python list
    embedding_list = face_encodings[0].tolist()
    
    return embedding_list


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
    # 1. OpenCV reads images in BGR, but face_recognition requires RGB
    rgb_frame = cv2.cvtColor(bgr_frame, cv2.COLOR_BGR2RGB)
    
    # 2. Extract facial embeddings from the current frame
    face_encodings = face_recognition.face_encodings(rgb_frame)
    
    # 3. If no face is in front of the camera, return an empty list immediately
    # (Allows the backend endpoint to handle it silently without throwing server errors)
    if len(face_encodings) == 0:
        return []
        
    # 4. Return the first detected face embedding as a standard list
    # This list will be sent straight to PostgreSQL to utilize pgvector's fast distance matching
    return face_encodings[0].tolist()
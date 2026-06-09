"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { saveEvent } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateEventDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.createEvent(name.trim()),
    onSuccess: (event) => {
      saveEvent(event);
      toast.success(`Event "${event.event_name}" created`);
      setOpen(false);
      setName("");
      router.push(`/events/${event.id}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Event</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) mutate();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            placeholder="Event name (e.g. Tech Conference 2026)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Button type="submit" disabled={!name.trim() || isPending}>
            {isPending ? "Creating…" : "Create Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

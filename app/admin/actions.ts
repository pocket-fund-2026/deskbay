"use server";

import { revalidatePath } from "next/cache";
import { setCommentStatus } from "@/lib/comments";
import { approveSubmission, rejectSubmission, retryGeocode } from "@/lib/submissions";

export async function approveAction(formData: FormData) {
  const id = Number(formData.get("id"));
  await approveSubmission(id);
  revalidatePath("/admin");
  revalidatePath("/mumbai");
  // /mumbai/[slug] pages render on-demand for a slug outside the static
  // build and then cache like any other page — without this, approving
  // (or later rejecting) a submission wouldn't be reflected on its own
  // detail page until something else happened to bust that cache.
  revalidatePath("/mumbai/[slug]", "page");
}

export async function rejectAction(formData: FormData) {
  const id = Number(formData.get("id"));
  await rejectSubmission(id);
  revalidatePath("/admin");
  revalidatePath("/mumbai");
  revalidatePath("/mumbai/[slug]", "page");
}

export async function retryGeocodeAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const address = String(formData.get("address") ?? "");
  await retryGeocode(id, address);
  revalidatePath("/admin");
}

export async function approveCommentAction(formData: FormData) {
  await setCommentStatus(Number(formData.get("id")), "approved");
  revalidatePath("/admin");
}

export async function rejectCommentAction(formData: FormData) {
  await setCommentStatus(Number(formData.get("id")), "rejected");
  revalidatePath("/admin");
}

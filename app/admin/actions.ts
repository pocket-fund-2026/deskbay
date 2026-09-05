"use server";

import { revalidatePath } from "next/cache";
import { approveSubmission, rejectSubmission, retryGeocode } from "@/lib/submissions";

export async function approveAction(formData: FormData) {
  const id = Number(formData.get("id"));
  await approveSubmission(id);
  // The static cafe list is a build-time import, but the /mumbai and cafe
  // detail routes read approved submissions from the database on every
  // request — clearing the cache here just drops any stale render of this
  // specific admin page, not the site's own data.
  revalidatePath("/admin");
  revalidatePath("/mumbai");
}

export async function rejectAction(formData: FormData) {
  const id = Number(formData.get("id"));
  await rejectSubmission(id);
  revalidatePath("/admin");
}

export async function retryGeocodeAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const address = String(formData.get("address") ?? "");
  await retryGeocode(id, address);
  revalidatePath("/admin");
}

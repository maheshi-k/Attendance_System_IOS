import type { MyProfile } from "../types/employee.types";
import { getAuthToken } from "../utils/authStorage";

export const getMyProfile = async (): Promise<MyProfile> => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL ?? "/api"}/employees/myprofile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken() ?? ""}`,
      },
    },
  );

  const result = (await response.json()) as {
    success?: boolean;
    data?: MyProfile;
    message?: string;
  };

  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Unable to load profile");
  }

  return result.data;
};

export type UpdateMyProfileData = Pick<
  MyProfile,
  | "first_name"
  | "last_name"
  | "email_2"
  | "mobile_no_1"
  | "mobile_no_2"
  | "address"
  | "gender"
  | "nic"
  | "profile_photo"
> & { profileFile?: File };

export const updateMyProfile = async (
  profile: UpdateMyProfileData,
): Promise<MyProfile> => {
  const formData = new FormData();

  formData.append("first_name", profile.first_name);
  formData.append("last_name", profile.last_name);
  formData.append("email_2", profile.email_2 ?? "");
  formData.append("mobile_no_1", profile.mobile_no_1 ?? "");
  formData.append("mobile_no_2", profile.mobile_no_2 ?? "");
  formData.append("address", profile.address ?? "");
  formData.append("gender", profile.gender ?? "");
  formData.append("nic", profile.nic ?? "");

  if (profile.profileFile) {
    formData.append("profile_photo", profile.profileFile);
  }

  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL ?? "/api"}/employees/myprofile`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAuthToken() ?? ""}`,
      },
      body: formData,
    },
  );

  const result = (await response.json()) as {
    data?: MyProfile;
    message?: string;
  };

  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Unable to update profile");
  }

  return result.data;
};

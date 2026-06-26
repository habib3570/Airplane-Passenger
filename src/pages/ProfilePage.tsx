import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMyProfile, updateProfile, updatePassport } from "../api/users.api";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../lib/errors";
import { formatDate } from "../lib/formatters";

interface ProfileForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePictureUrl: string;
}

interface PassportForm {
  passportNumber: string;
  issuingCountry: string;
  issuedDate: string;
  expiryDate: string;
}

function ProfileTab({
  form,
  setForm,
  onSave,
  isSaving,
}: {
  form: ProfileForm;
  setForm: (fn: (p: ProfileForm) => ProfileForm) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">
        Personal Information
      </h2>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">First Name</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) =>
                setForm((p) => ({ ...p, firstName: e.target.value }))
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Last Name</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) =>
                setForm((p) => ({ ...p, lastName: e.target.value }))
              }
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="label">Phone Number</label>
          <input
            type="tel"
            value={form.phoneNumber}
            onChange={(e) =>
              setForm((p) => ({ ...p, phoneNumber: e.target.value }))
            }
            className="input-field"
            placeholder="+1 234 567 8900"
          />
        </div>
        <div>
          <label className="label">Profile Picture URL</label>
          <input
            type="url"
            value={form.profilePictureUrl}
            onChange={(e) =>
              setForm((p) => ({ ...p, profilePictureUrl: e.target.value }))
            }
            className="input-field"
            placeholder="https://..."
          />
        </div>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

function PassportTab({
  form,
  setForm,
  onSave,
  isSaving,
}: {
  form: PassportForm;
  setForm: (fn: (p: PassportForm) => PassportForm) => void;
  onSave: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="card p-5">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">
        Passport Information
      </h2>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Passport Number</label>
            <input
              type="text"
              value={form.passportNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, passportNumber: e.target.value }))
              }
              className="input-field"
              placeholder="AB1234567"
            />
          </div>
          <div>
            <label className="label">Issuing Country</label>
            <input
              type="text"
              value={form.issuingCountry}
              onChange={(e) =>
                setForm((p) => ({ ...p, issuingCountry: e.target.value }))
              }
              className="input-field"
              placeholder="BD"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Issue Date</label>
            <input
              type="date"
              value={form.issuedDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, issuedDate: e.target.value }))
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Expiry Date</label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, expiryDate: e.target.value }))
              }
              className="input-field"
            />
          </div>
        </div>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? "Saving..." : "Save Passport Info"}
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "passport">("profile");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    phoneNumber: profile?.phoneNumber ?? "",
    profilePictureUrl: profile?.profilePictureUrl ?? "",
  });

  const [passportForm, setPassportForm] = useState<PassportForm>({
    passportNumber: "",
    issuingCountry: "",
    issuedDate: "",
    expiryDate: "",
  });

  const profileMutation = useMutation({
    mutationFn: () => updateProfile(profileForm),
    onSuccess: () => toast.success("Profile updated successfully."),
    onError: (err: unknown) => toast.error(getErrorMessage(err)),
  });

  const passportMutation = useMutation({
    mutationFn: () => updatePassport(passportForm),
    onSuccess: () => toast.success("Passport info saved."),
    onError: (err: unknown) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information
        </p>
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white">
            {profile?.fullName?.charAt(0) ?? "U"}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {profile?.fullName}
            </p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="badge bg-primary-50 text-primary-700">
                {profile?.role}
              </span>
              {profile?.isEmailVerified && (
                <span className="badge bg-green-50 text-green-700">
                  Email Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 text-sm">
          <div>
            <p className="text-xs text-gray-400">Date of Birth</p>
            <p className="font-medium text-gray-900 mt-0.5">
              {profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Nationality</p>
            <p className="font-medium text-gray-900 mt-0.5">
              {profile?.nationality ?? "Not set"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5 flex gap-2">
        {(["profile", "passport"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-150 " +
              (activeTab === tab
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200")
            }
          >
            {tab === "profile" ? "Personal Info" : "Passport"}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <ProfileTab
          form={profileForm}
          setForm={setProfileForm}
          onSave={() => profileMutation.mutate()}
          isSaving={profileMutation.isPending}
        />
      )}

      {activeTab === "passport" && (
        <PassportTab
          form={passportForm}
          setForm={setPassportForm}
          onSave={() => passportMutation.mutate()}
          isSaving={passportMutation.isPending}
        />
      )}
    </div>
  );
}

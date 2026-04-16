import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Camera, LockKeyhole, UserCircle2 } from "lucide-react";
import authService from "../../services/authService";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/authContext";

const ProfilePage = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    profileImage: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        const userProfile = response?.data;
        setProfile(userProfile);
        setProfileForm({
          username: userProfile?.username || "",
          email: userProfile?.email || "",
          profileImage: userProfile?.profileImage || "",
        });
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);

    try {
      const response = await authService.updateProfile(profileForm);
      setProfile((prev) => ({ ...prev, ...response?.data }));
      updateUser(response?.data || {});
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setSavingPassword(true);

    try {
      await authService.changePassword(passwordForm);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success("Password changed successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="Apni account details aur password yahan manage karo."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] dark:border-slate-200/80 dark:bg-white/95">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-200">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.username}
                  className="h-full w-full rounded-[2rem] object-cover"
                />
              ) : (
                <UserCircle2 size={44} />
              )}
            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-900">
              {profile?.username}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-600">{profile?.email}</p>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Joined {new Date(profile?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <form
            onSubmit={handleProfileSubmit}
            className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] dark:border-slate-200/80 dark:bg-white/95"
          >
            <div className="mb-5 flex items-center gap-3">
              <Camera className="text-emerald-500" size={18} />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-900">
                Profile Details
              </h3>
            </div>

            <div className="grid gap-4">
              <input
                type="text"
                value={profileForm.username}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    username: event.target.value,
                  }))
                }
                placeholder="Username"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="email"
                value={profileForm.email}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                placeholder="Email"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="url"
                value={profileForm.profileImage}
                onChange={(event) =>
                  setProfileForm((prev) => ({
                    ...prev,
                    profileImage: event.target.value,
                  }))
                }
                placeholder="Profile image URL"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="mt-5">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>

          <form
            onSubmit={handlePasswordSubmit}
            className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] dark:border-slate-200/80 dark:bg-white/95"
          >
            <div className="mb-5 flex items-center gap-3">
              <LockKeyhole className="text-blue-500" size={18} />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-900">
                Change Password
              </h3>
            </div>

            <div className="grid gap-4">
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: event.target.value,
                  }))
                }
                placeholder="Current password"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: event.target.value,
                  }))
                }
                placeholder="New password"
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="mt-5">
              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

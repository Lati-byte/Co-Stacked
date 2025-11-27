// src/pages/ProfilePage.jsx

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ProfilePage.module.css";

// Import Redux Actions
import { fetchUsers, recordProfileView } from "../features/users/usersSlice";
import { fetchProjects } from "../features/projects/projectsSlice";
import { fetchReviewsForUser } from "../features/reviews/reviewsSlice";
import { fetchReceivedInterests } from "../features/interests/interestsSlice";

// Import All UI Components
import { Card } from "../components/shared/Card";
import { Tag } from "../components/shared/Tag";
import { ProjectCard } from "../components/shared/ProjectCard";
import { ReviewCard } from "../components/reviews/ReviewCard";
import { ProfileEditor } from "../components/profile/ProfileEditor";
import { ProfileHeader } from "../components/profile/ProfileHeader"; // New header component
import { AvatarUploadModal } from "../components/profile/AvatarUploadModal"; // The new modal
import { LeaveReviewModal } from "../components/reviews/LeaveReviewModal";
import { ProfileBoostModal } from "../components/billing/ProfileBoostModal";
import { MapPin, Link as LinkIcon } from "lucide-react";

const LoadingSpinner = () => (
  <div className={styles.loader}>Loading profile...</div>
);

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();

  // State for controlling modals
  const [isEditing, setIsEditing] = useState(false);
  const [isBoostModalOpen, setBoostModalOpen] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  // Selectors for Redux state
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const { items: allUsers, status: usersStatus } = useSelector(
    (state) => state.users
  );
  const { items: allProjects, status: projectsStatus } = useSelector(
    (state) => state.projects
  );
  const { reviewsByUser, status: reviewsStatus } = useSelector(
    (state) => state.reviews
  );
  const { receivedItems: founderConnections } = useSelector(
    (state) => state.interests
  );

  const userToDisplay = userId
    ? allUsers.find((u) => u._id === userId)
    : loggedInUser;
  const isOwnProfile =
    userToDisplay && loggedInUser && userToDisplay._id === loggedInUser._id;

  // Data fetching effects
  useEffect(() => {
    if (usersStatus === "idle") dispatch(fetchUsers());
    if (projectsStatus === "idle") dispatch(fetchProjects());
    if (userToDisplay?._id) dispatch(fetchReviewsForUser(userToDisplay._id));
    if (loggedInUser?.role === "founder") dispatch(fetchReceivedInterests());
  }, [userToDisplay?._id, usersStatus, projectsStatus, loggedInUser, dispatch]);

  // Record profile view effect
  useEffect(() => {
    if (userId && loggedInUser && userId !== loggedInUser._id) {
      dispatch(recordProfileView(userId));
    }
  }, [userId, loggedInUser, dispatch]);

  const handleShare = async () => {
    if (!userToDisplay) return;

    const shareData = {
      title: `${userToDisplay.name} on CoStacked`,
      text: `Check out ${userToDisplay.name}'s profile on CoStacked, the platform for founders and developers.`,
      url: window.location.href // The current page URL is the most reliable link
    };

    // Use the modern Web Share API if available (on mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying the URL to the clipboard for desktop browsers
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Reset feedback message
      } catch (err) {
        console.error('Failed to copy URL:', err);
        setCopySuccess('Failed!');
        setTimeout(() => setCopySuccess(''), 2000);
      }
    }
  };

  // Derived state for UI logic
  const developerReviews = reviewsByUser[userToDisplay?._id] || [];
  const userProjects =
    userToDisplay?.role === "founder"
      ? allProjects.filter((p) => p.founderId === userToDisplay._id)
      : [];
  const averageRating =
    developerReviews.length > 0
      ? developerReviews.reduce((acc, r) => acc + r.rating, 0) /
        developerReviews.length
      : 0;
  const sharedConnections = founderConnections.filter(
    (conn) =>
      conn.senderId?._id === userToDisplay?._id && conn.status === "approved"
  );
  const reviewableProjects = sharedConnections.filter(
    (conn) =>
      !developerReviews.some(
        (review) => review.projectId?._id === conn.projectId?._id
      )
  );
  const canLeaveReview =
    !isOwnProfile &&
    loggedInUser?.role === "founder" &&
    userToDisplay?.role === "developer" &&
    reviewableProjects.length > 0;

  if (
    usersStatus === "loading" ||
    projectsStatus === "loading" ||
    reviewsStatus === "loading" ||
    !userToDisplay
  ) {
    return (
      <div className={styles.pageContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {/* All modals are rendered at the top level */}
      <ProfileBoostModal
        user={userToDisplay}
        open={isBoostModalOpen}
        onClose={() => setBoostModalOpen(false)}
      />
      <LeaveReviewModal
        developer={userToDisplay}
        reviewableProjects={reviewableProjects}
        open={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
      />
      <AvatarUploadModal
        open={isAvatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />

      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {isEditing && isOwnProfile ? (
            <ProfileEditor
              user={userToDisplay}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Card>
              {isOwnProfile &&
                userToDisplay.isBoosted &&
                new Date(userToDisplay.boostExpiresAt) > new Date() && (
                  <div className={styles.boostBanner}>
                    Your profile is boosted until{" "}
                    {formatDate(userToDisplay.boostExpiresAt)}.
                  </div>
                )}

               <ProfileHeader
                user={userToDisplay}
                isOwnProfile={isOwnProfile}
                averageRating={averageRating}
                reviewCount={developerReviews.length}
                canLeaveReview={canLeaveReview}
                onEdit={() => setIsEditing(true)}
                onBoost={() => setBoostModalOpen(true)}
                onReview={() => setReviewModalOpen(true)}
                onAvatarClick={() => setAvatarModalOpen(true)}
                onShare={handleShare}
                copySuccess={copySuccess}
              />

              <div className={styles.content}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>About Me:</h3>
                  <p>{userToDisplay.bio || "No bio provided."}</p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Skills:</h3>
                  <div className={styles.skillsContainer}>
                    {Array.isArray(userToDisplay.skills) &&
                    userToDisplay.skills.length > 0 ? (
                      userToDisplay.skills.map((s) => <Tag key={s}>{s}</Tag>)
                    ) : (
                      <p>No skills listed.</p>
                    )}
                  </div>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <MapPin size={18} />
                    <span>{userToDisplay.location || "N/A"}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <LinkIcon size={18} />
                    <a
                      href={userToDisplay.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Portfolio
                    </a>
                  </div>
                  <p>
                    <strong>Availability:</strong>{" "}
                    {userToDisplay.availability || "N/A"}
                  </p>
                </div>

                {userProjects.length > 0 && (
                  <>
                    <div className={styles.separator} />
                    <h2 className={styles.title}>Posted Projects</h2>
                    <div className={styles.projectsGrid}>
                      {userProjects.map((p) => (
                        <ProjectCard key={p._id} project={p} />
                      ))}
                    </div>
                  </>
                )}

                {developerReviews.length > 0 && (
                  <>
                    <div className={styles.separator} />
                    <h2 className={styles.title}>Reviews</h2>
                    <div className={styles.reviewsGrid}>
                      {developerReviews.map((r) => (
                        <ReviewCard key={r._id} review={r} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

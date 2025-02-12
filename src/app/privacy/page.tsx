// src/app/pages/privacy.tsx

"use client";

import { Typography, Container } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md" sx={{ marginTop: 8 }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>
        **Last Updated:** 01/14/2025
      </Typography>
      <Typography variant="body1" paragraph>
        This Privacy Policy explains how we collect, use, and protect your
        information when you use our application, including signing in with
        Google OAuth.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Information We Collect
      </Typography>
      <Typography variant="body1" paragraph>
        When you sign in using Google OAuth, we may collect the following
        information:
        <ul>
          <li>Your Google account name</li>
          <li>Your Google account email address</li>
          <li>Your profile picture</li>
          <li>A unique identifier for your Google account</li>
        </ul>
      </Typography>
      <Typography variant="body1" paragraph>
        We do not collect your Google account password or access your private
        data without explicit permission.
      </Typography>

      <Typography variant="h5" gutterBottom>
        How We Use Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        The information we collect is used for:
        <ul>
          <li>Authenticating your identity and providing secure access.</li>
          <li>Personalizing your experience.</li>
          <li>Communicating with you regarding your account or usage.</li>
        </ul>
      </Typography>

      <Typography variant="h5" gutterBottom>
        Data Sharing and Security
      </Typography>
      <Typography variant="body1" paragraph>
        We do not share your information with third parties except as necessary
        to operate our service, comply with legal obligations, or protect our
        rights. Your data is stored securely and retained only as long as needed
        for the purposes outlined.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Your Control Over Your Information
      </Typography>
      <Typography variant="body1" paragraph>
        You may disconnect your Google account at any time. Navigate to{" "}
        <a
          href="https://myaccount.google.com/connections?continue=https%3A%2F%2Fmyaccount.google.com%2Fdata-and-privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          your account
        </a>{" "}
        settings and revoke access for Torch Cloud.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Changes to This Privacy Policy
      </Typography>
      <Typography variant="body1" paragraph>
        We may update this policy periodically. Changes will be posted on this
        page, so we encourage regular review.
      </Typography>
    </Container>
  );
}

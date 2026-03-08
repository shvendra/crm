import { IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import { toast } from "react-hot-toast";

export default function ContactButtons({ stream, currentLang, isVerified }) {
  const handleRestrictedAction = () => {
toast.error(
  t('verificationRequired') ||
    "Access denied: You are not verified. Please obtain a Verified Badge first to unlock search features. Verification ensures trust and safety for all users."
);

  };

  return (
    <>
      <IconButton
        color="success"
        component="a"
        href={
          isVerified
            ? `https://wa.me/+91${stream.employerPhone}?text=${encodeURIComponent(
                buildWhatsappMessage(stream, currentLang)
              )}`
            : undefined
        }
        onClick={!isVerified ? handleRestrictedAction : undefined}
        target={isVerified ? "_blank" : undefined}
        rel={isVerified ? "noopener noreferrer" : undefined}
        sx={{ p: 0, m: 0, minWidth: 32 }}
      >
        <WhatsAppIcon fontSize="small" sx={{ color: "#25D366" }} />
      </IconButton>

      <IconButton
        color="primary"
        component="a"
        href={isVerified ? `tel:${stream.employerPhone}` : undefined}
        onClick={!isVerified ? handleRestrictedAction : undefined}
        sx={{ p: 0, m: 0, minWidth: 32, color: "#90caf9" }}
      >
        <CallIcon fontSize="small" />
      </IconButton>
    </>
  );
}

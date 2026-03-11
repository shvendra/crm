import { IconButton } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import { toast } from "react-hot-toast";
import { Context } from "../../main";
import React, { useContext, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const whatsappTemplates = {
  en: ({ name, phone, workType, subCategory, ern }) =>
    `Hello, I’m interested in this requirement.
Name: ${name},
Mobile: ${phone},
Work Type: ${workType}, ${subCategory},
ERN Number: ${ern}`,

  hi: ({ name, phone, workType, subCategory, ern }) =>
    `नमस्ते, मुझे इस कार्य आवश्यकता में रुचि है।
नाम: ${name},
मोबाइल नंबर: ${phone}.
कार्य का प्रकार: ${workType}, ${subCategory}.
ERN नंबर: ${ern}`,

  mr: ({ name, phone, workType, subCategory, ern }) =>
    `नमस्कार, मला या कामाच्या आवश्यकतेमध्ये रस आहे.
नाव: ${name},
मोबाईल नंबर: ${phone},
कामाचा प्रकार: ${workType}, ${subCategory},
ERN क्रमांक: ${ern}`,

  gu: ({ name, phone, workType, subCategory, ern }) =>
    `નમસ્તે, મને આ કામની જરૂરિયાતમાં રસ છે.
નામ: ${name},
મોબાઇલ નંબર: ${phone},
કામનો પ્રકાર: ${workType}, ${subCategory},
ERN નંબર: ${ern}`,
};
export default function ContactButtons({ stream, currentLang, isVerified }) {
    const { t, i18n } = useTranslation();
  
  const handleRestrictedAction = () => {
toast.error(
  t('verificationRequired') ||
    "Access denied: You are not verified. Please obtain a Verified Badge first to unlock search features. Verification ensures trust and safety for all users."
);

  };
const buildWhatsappMessage = (stream, lang = "en") => {
  const template = whatsappTemplates[lang] || whatsappTemplates.en;
  const { user } = useContext(Context);

  return template({
    name: user?.name || "N/A",
    phone: user?.phone || "N/A",
    workType: stream.workType,
    subCategory: stream.subCategory,
    ern: stream.ern_num,
  });
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

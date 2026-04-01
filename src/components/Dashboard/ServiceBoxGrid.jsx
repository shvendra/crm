import React, { useContext, useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import CarpenterIcon from '@mui/icons-material/Handyman';
import PaintIcon from '@mui/icons-material/FormatPaint';
import WeldingIcon from '@mui/icons-material/Build';
import HouseIcon from '@mui/icons-material/House';
import SecurityIcon from '@mui/icons-material/Security';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FestivalIcon from '@mui/icons-material/Festival';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import config from '../../config';

import RestaurantIcon from '@mui/icons-material/Restaurant';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { Context } from '../../main';


/* ---------- SERVICES (12 Main Categories) ---------- */
export const services = [
  {
    en: "Industrial Workers",
    hi: "औद्योगिक श्रमिक",
    mr: "औद्योगिक कामगार",
    gu: "ઔદ્યોગિક કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/Industrial_Workers.jpg`,
  },
  {
    en: "Construction Workers",
    hi: "निर्माण श्रमिक",
    mr: "बांधकाम कामगार",
    gu: "બાંધકામ કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/Construction_Workers.jpg`,
  },
  {
    en: "Logistics & Warehouse Workers",
    hi: "लॉजिस्टिक्स एवं वेयरहाउस श्रमिक",
    mr: "लॉजिस्टिक्स व वेअरहाऊस कामगार",
    gu: "લોજિસ્ટિક્સ અને વેરહાઉસ કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/Logistics_Warehouse.jpg`,
  },
  {
    en: "Agriculture & Farm Workers",
    hi: "कृषि एवं खेत मजदूर",
    mr: "शेती व शेतमजूर",
    gu: "કૃષિ અને ખેતમજૂરો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/Agriculture_Farm_Workers.jpg`,
  },
  {
    en: "Household / Domestic Workers",
    hi: "घरेलू कामगार",
    mr: "घरगुती कामगार",
    gu: "ઘરેલુ કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/cleaning.png`,
  },
  {
    en: "Automobile & Workshop Workers",
    hi: "ऑटोमोबाइल वर्कशॉप कर्मचारी",
    mr: "ऑटोमोबाइल वर्कशॉप कामगार",
    gu: "ઓટોમોબાઇલ અને વર્કશોપ કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/automobile.png`,
  },
  {
    en: "Retail & Service Workers",
    hi: "रिटेल एवं सेवा कर्मचारी",
    mr: "रिटेल व सेवा कामगार",
    gu: "રિટેલ અને સેવા કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/retail.png`,
  },
  {
    en: "Hospitality Workers",
    hi: "हॉस्पिटैलिटी कर्मचारी",
    mr: "हॉस्पिटॅलिटी कामगार",
    gu: "હોસ્પિટાલિટી કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/hospitality.png`,
  },
  {
    en: "Healthcare Support Workers",
    hi: "स्वास्थ्य सहायता कर्मचारी",
    mr: "आरोग्य सहाय्यक कामगार",
    gu: "હેલ્થકેર સહાયક કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/healthcare.png`,
  },
  {
    en: "Security & Facility Workers",
    hi: "सुरक्षा एवं सुविधा कर्मचारी",
    mr: "सुरक्षा व सुविधा कामगार",
    gu: "સુરક્ષા અને સુવિધા કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/security.png`,
  },
  {
    en: "Driving & Transport Workers",
    hi: "ड्राइविंग एवं परिवहन कर्मचारी",
    mr: "ड्रायव्हिंग व परिवहन कामगार",
    gu: "ડ્રાઇવિંગ અને પરિવહન કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/drivers.png`,
  },
  {
    en: "Electrical & Wiring Workers",
    hi: "बिजली और वायरिंग कर्मचारी",
    mr: "विद्युत व वायरिंग कामगार",
    gu: "વિદ્યુત અને વાયરિંગ કામદારો",
    image: `${config.FILE_BASE_URL}/ImagesWeb/Electrical_and_Wiring.jpg`,
  },
];
export const servicesForOtherRoles = [
  {
    en: "Industrial Work",
    hi: "औद्योगिक काम",
    mr: "औद्योगिक काम",
    gu: "ઔદ્યોગિક કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/Industrial_Workers.jpg`,
  },
  {
    en: "Construction Work",
    hi: "निर्माण कार्य",
    mr: "बांधकाम काम",
    gu: "બાંધકામ કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/Construction_Workers.jpg`,
  },
  {
    en: "Logistics & Warehouse Work",
    hi: "लॉजिस्टिक्स एवं वेयरहाउस कार्य",
    mr: "लॉजिस्टिक्स व वेअरहाऊस काम",
    gu: "લોજિસ્ટિક્સ અને વેરહાઉસ કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/Logistics_Warehouse.jpg`,
  },
  {
    en: "Agriculture & Farm Work",
    hi: "कृषि एवं खेत कार्य",
    mr: "शेती व शेत काम",
    gu: "કૃષિ અને ખેત કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/Agriculture_Farm_Workers.jpg`,
  },
  {
    en: "Household / Domestic Work",
    hi: "घरेलू कार्य",
    mr: "घरगुती काम",
    gu: "ઘરેલુ કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/cleaning.png`,
  },
  {
    en: "Automobile & Workshop Work",
    hi: "ऑटोमोबाइल वर्कशॉप कार्य",
    mr: "ऑटोमोबाइल वर्कशॉप काम",
    gu: "ઓટોમોબાઇલ અને વર્કશોપ કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/automobile.png`,
  },
  {
    en: "Retail & Service Work",
    hi: "रिटेल एवं सेवा कार्य",
    mr: "रिटेल व सेवा काम",
    gu: "રિટેલ અને સેવા કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/retail.png`,
  },
  {
    en: "Hospitality Work",
    hi: "हॉस्पिटैलिटी कार्य",
    mr: "हॉस्पिटॅलिटी काम",
    gu: "હોસ્પિટાલિટી કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/hospitality.png`,
  },
  {
    en: "Healthcare Support Work",
    hi: "स्वास्थ्य सहायता कार्य",
    mr: "आरोग्य सहाय्यक काम",
    gu: "હેલ્થકેર સહાયક કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/healthcare.png`,
  },
  {
    en: "Security & Facility Work",
    hi: "सुरक्षा एवं सुविधा कार्य",
    mr: "सुरक्षा व सुविधा काम",
    gu: "સુરક્ષા અને સુવિધા કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/security.png`,
  },
  {
    en: "Driving & Transport Work",
    hi: "ड्राइविंग एवं परिवहन कार्य",
    mr: "ड्रायव्हिंग व परिवहन काम",
    gu: "ડ્રાઇવિંગ અને પરિવહન કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/drivers.png`,
  },
  {
    en: "Electrical & Wiring Work",
    hi: "बिजली और वायरिंग कार्य",
    mr: "विद्युत व वायरिंग काम",
    gu: "વિદ્યુત અને વાયરિંગ કામ",
    image: `${config.FILE_BASE_URL}/ImagesWeb/Electrical_and_Wiring.jpg`,
  },
];

/* ---------- BACKGROUND COLORS ---------- */
export const getBackgroundColor = title => {
  switch (title) {
    case 'Industrial Workers':
      return '#E3F2FD';
    case 'Construction Workers':
      return '#F3E5F5';
    case 'Logistics & Warehouse Workers':
      return '#FFF3E0';
    case 'Agriculture & Farm Workers':
      return '#E8F5E9';
    case 'Household / Domestic Workers':
      return '#FFFDE7';
    case 'Automobile & Workshop Workers':
      return '#E0F7FA';
    case 'Retail & Service Workers':
      return '#E8F5E9';
    case 'Hospitality Workers':
      return '#FFF3E0';
    case 'Healthcare Support Workers':
      return '#E0F7FA';
    case 'Security & Facility Workers':
      return '#FFEBEE';
    case 'Driving & Transport Workers':
      return '#FFF3E0';
    case 'Electrical & Wiring Workers':
      return '#FFF3E0';
    default:
      return '#FFFFFF';
  }
};


const ServiceBoxGrid = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthorized, user, setUser } = useContext(Context);

const handleClick = service => {
  const userType = user?.role; // "Agent" | "Worker" | "SelfWorker"

  if (userType === 'Agent' || userType === 'Worker' || userType === 'SelfWorker') {
   navigate("/dashboard/requirements")
  } else {
 navigate('/verified-agents', {
    state: {
      service: service.en,
    },
  });
  }
 
};



const serviceList =
  user.role === 'Employer' ? services : servicesForOtherRoles;

return (
  <Box
    sx={{
      width: "100%",
      mt: 1.5,
      mb: 2,
      px: { xs: 1, sm: 1.5 },
    }}
  >
    <Box
      sx={{
        display: "grid",
        gap: { xs: 1.2, sm: 1.5, md: 1.8 },
        gridTemplateColumns: {
          xs: "repeat(3, 1fr)",
          sm: "repeat(4, 1fr)",
          md: "repeat(5, 1fr)",
          lg: "repeat(6, 1fr)",
        },
      }}
    >
      {serviceList.map((service, index) => {
        const title =
          i18n.language === "hi"
            ? service.hi
            : i18n.language === "mr"
            ? service.mr
            : i18n.language === "gu"
            ? service.gu
            : service.en;

     return (
  <Card
    key={index}
    onClick={() => handleClick(service)}
    sx={{
      position: "relative",
      overflow: "hidden",
      borderRadius: "22px",
      cursor: "pointer",
      minHeight: { xs: 118, sm: 132, md: 140 },
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      border: "1px solid rgba(226,232,240,0.9)",
      boxShadow: "0 14px 30px rgba(15, 23, 42, 0.08)",
      transition: "all 0.3s ease",
      backgroundColor: "#fff",

      backgroundImage: `url(${service.image || "/images/default-worker.jpg"})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",

      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(180deg, rgba(15,23,42,0.10) 0%, rgba(15,23,42,0.22) 45%, rgba(15,23,42,0.72) 100%)",
        zIndex: 0,
      },

      "&::after": {
        content: '""',
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 55%)",
        zIndex: 0,
      },

      "&:hover": {
        transform: "translateY(-6px) scale(1.02)",
        boxShadow: "0 22px 40px rgba(37, 99, 235, 0.16)",
        borderColor: "#93c5fd",
      },

      "&:active": {
        transform: "scale(0.98)",
      },
    }}
  >
    <CardContent
      sx={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        p: 1.2,
        pb: "1.2rem !important",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          borderRadius: "16px",
          px: 1,
          py: 1,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: 11.5, sm: 12.5, md: 13.5 },
            lineHeight: 1.4,
            color: "#ffffff",
            textShadow: "0 2px 10px rgba(0,0,0,0.35)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: { xs: 30, sm: 34 },
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
      })}
    </Box>
  </Box>
);
};

export default ServiceBoxGrid;
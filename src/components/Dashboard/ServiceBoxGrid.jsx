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


import RestaurantIcon from '@mui/icons-material/Restaurant';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { Context } from '../../main';


/* ---------- SERVICES (12 Main Categories) ---------- */
export const services = [
  {
    en: 'Industrial Workers',
    hi: 'औद्योगिक श्रमिक',
    mr: 'औद्योगिक कामगार',
    gu: 'ઔદ્યોગિક કામદારો',
    icon: <ConstructionIcon sx={{ fontSize: 36, color: '#1976d2' }} />,
  },
  {
    en: 'Construction Workers',
    hi: 'निर्माण श्रमिक',
    mr: 'बांधकाम कामगार',
    gu: 'બાંધકામ કામદારો',
    icon: <CarpenterIcon sx={{ fontSize: 36, color: '#6d4c41' }} />,
  },
  {
    en: 'Logistics & Warehouse Workers',
    hi: 'लॉजिस्टिक्स एवं वेयरहाउस श्रमिक',
    mr: 'लॉजिस्टिक्स व वेअरहाऊस कामगार',
    gu: 'લોજિસ્ટિક્સ અને વેરહાઉસ કામદારો',
    icon: <LocalShippingIcon sx={{ fontSize: 36, color: '#f9a825' }} />,
  },
  {
    en: 'Agriculture & Farm Workers',
    hi: 'कृषि एवं खेत मजदूर',
    mr: 'शेती व शेतमजूर',
    gu: 'કૃષિ અને ખેતમજૂરો',
    icon: <AgricultureIcon sx={{ fontSize: 36, color: '#2e7d32' }} />,
  },
  {
    en: 'Household / Domestic Workers',
    hi: 'घरेलू कामगार',
    mr: 'घरगुती कामगार',
    gu: 'ઘરેલુ કામદારો',
    icon: <HomeWorkIcon sx={{ fontSize: 36, color: '#fbc02d' }} />,
  },
  {
    en: 'Automobile & Workshop Workers',
    hi: 'ऑटोमोबाइल वर्कशॉप कर्मचारी',
    mr: 'ऑटोमोबाइल वर्कशॉप कामगार',
    gu: 'ઓટોમોબાઇલ અને વર્કશોપ કામદારો',
    icon: <ElectricalServicesIcon sx={{ fontSize: 36, color: '#00796b' }} />,
  },
  {
    en: 'Retail & Service Workers',
    hi: 'रिटेल एवं सेवा कर्मचारी',
    mr: 'रिटेल व सेवा कामगार',
    gu: 'રિટેલ અને સેવા કામદારો',
    icon: <CleaningServicesIcon sx={{ fontSize: 36, color: '#388e3c' }} />,
  },
  {
    en: 'Hospitality Workers',
    hi: 'हॉस्पिटैलिटी कर्मचारी',
    mr: 'हॉस्पिटॅलिटी कामगार',
    gu: 'હોસ્પિટાલિટી કામદારો',
    icon: <RestaurantIcon sx={{ fontSize: 36, color: '#ef6c00' }} />,
  },
  {
    en: 'Healthcare Support Workers',
    hi: 'स्वास्थ्य सहायता कर्मचारी',
    mr: 'आरोग्य सहाय्यक कामगार',
    gu: 'હેલ્થકેર સહાયક કામદારો',
    icon: <MedicalServicesIcon sx={{ fontSize: 36, color: '#0288d1' }} />,
  },
  {
    en: 'Security & Facility Workers',
    hi: 'सुरक्षा एवं सुविधा कर्मचारी',
    mr: 'सुरक्षा व सुविधा कामगार',
    gu: 'સુરક્ષા અને સુવિધા કામદારો',
    icon: <SecurityIcon sx={{ fontSize: 36, color: '#d32f2f' }} />,
  },
  {
    en: 'Driving & Transport Workers',
    hi: 'ड्राइविंग एवं परिवहन कर्मचारी',
    mr: 'ड्रायव्हिंग व परिवहन कामगार',
    gu: 'ડ્રાઇવિંગ અને પરિવહન કામદારો',
    icon: <DeliveryDiningIcon sx={{ fontSize: 36, color: '#f9a825' }} />,
  },
  {
    en: 'Electrical & Wiring Workers',
    hi: 'बिजली और वायरिंग कर्मचारी',
    mr: 'विद्युत व वायरिंग कामगार',
    gu: 'વિદ્યુત અને વાયરિંગ કામદારો',
    icon: <ElectricalServicesIcon sx={{ fontSize: 36, color: '#f57c00' }} />,
  },
];
export const servicesForOtherRoles = [
  {
    en: 'Industrial Work',
    hi: 'औद्योगिक काम',
    mr: 'औद्योगिक काम',
    gu: 'ઔદ્યોગિક કામ',
    icon: <ConstructionIcon sx={{ fontSize: 36, color: '#1976d2' }} />,
  },
  {
    en: 'Construction Work',
    hi: 'निर्माण कार्य',
    mr: 'बांधकाम काम',
    gu: 'બાંધકામ કામ',
    icon: <CarpenterIcon sx={{ fontSize: 36, color: '#6d4c41' }} />,
  },
  {
    en: 'Logistics & Warehouse Work',
    hi: 'लॉजिस्टिक्स एवं वेयरहाउस कार्य',
    mr: 'लॉजिस्टिक्स व वेअरहाऊस काम',
    gu: 'લોજિસ્ટિક્સ અને વેરહાઉસ કામ',
    icon: <LocalShippingIcon sx={{ fontSize: 36, color: '#f9a825' }} />,
  },
  {
    en: 'Agriculture & Farm Work',
    hi: 'कृषि एवं खेत कार्य',
    mr: 'शेती व शेत काम',
    gu: 'કૃષિ અને ખેત કામ',
    icon: <AgricultureIcon sx={{ fontSize: 36, color: '#2e7d32' }} />,
  },
  {
    en: 'Household / Domestic Work',
    hi: 'घरेलू कार्य',
    mr: 'घरगुती काम',
    gu: 'ઘરેલુ કામ',
    icon: <HomeWorkIcon sx={{ fontSize: 36, color: '#fbc02d' }} />,
  },
  {
    en: 'Automobile & Workshop Work',
    hi: 'ऑटोमोबाइल वर्कशॉप कार्य',
    mr: 'ऑटोमोबाइल वर्कशॉप काम',
    gu: 'ઓટોમોબાઇલ અને વર્કશોપ કામ',
    icon: <ElectricalServicesIcon sx={{ fontSize: 36, color: '#00796b' }} />,
  },
  {
    en: 'Retail & Service Work',
    hi: 'रिटेल एवं सेवा कार्य',
    mr: 'रिटेल व सेवा काम',
    gu: 'રિટેલ અને સેવા કામ',
    icon: <CleaningServicesIcon sx={{ fontSize: 36, color: '#388e3c' }} />,
  },
  {
    en: 'Hospitality Work',
    hi: 'हॉस्पिटैलिटी कार्य',
    mr: 'हॉस्पिटॅलिटी काम',
    gu: 'હોસ્પિટાલિટી કામ',
    icon: <RestaurantIcon sx={{ fontSize: 36, color: '#ef6c00' }} />,
  },
  {
    en: 'Healthcare Support Work',
    hi: 'स्वास्थ्य सहायता कार्य',
    mr: 'आरोग्य सहाय्यक काम',
    gu: 'હેલ્થકેર સહાયક કામ',
    icon: <MedicalServicesIcon sx={{ fontSize: 36, color: '#0288d1' }} />,
  },
  {
    en: 'Security & Facility Work',
    hi: 'सुरक्षा एवं सुविधा कार्य',
    mr: 'सुरक्षा व सुविधा काम',
    gu: 'સુરક્ષા અને સુવિધા કામ',
    icon: <SecurityIcon sx={{ fontSize: 36, color: '#d32f2f' }} />,
  },
  {
    en: 'Driving & Transport Work',
    hi: 'ड्राइविंग एवं परिवहन कार्य',
    mr: 'ड्रायव्हिंग व परिवहन काम',
    gu: 'ડ્રાઇવિંગ અને પરિવહન કામ',
    icon: <DeliveryDiningIcon sx={{ fontSize: 36, color: '#f9a825' }} />,
  },
  {
    en: 'Electrical & Wiring Work',
    hi: 'बिजली और वायरिंग कार्य',
    mr: 'विद्युत व वायरिंग काम',
    gu: 'વિદ્યુત અને વાયરિંગ કામ',
    icon: <ElectricalServicesIcon sx={{ fontSize: 36, color: '#f57c00' }} />,
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
              borderRadius: 3,
              cursor: "pointer",
              background:
                "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
              border: "1px solid #e3eefc",
              boxShadow: "0 8px 22px rgba(15, 23, 42, 0.08)",
              transition: "all 0.28s ease",
              minHeight: { xs: 108, sm: 118, md: 124 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 1,
              py: 1.2,
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(25,118,210,0.06) 0%, transparent 60%)",
                pointerEvents: "none",
              },
              "&:hover": {
                transform: "translateY(-6px) scale(1.02)",
                boxShadow: "0 18px 32px rgba(25, 118, 210, 0.16)",
                borderColor: "#90caf9",
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
                p: 0,
                pb: "0 !important",
                textAlign: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: { xs: 52, sm: 58 },
                  height: { xs: 52, sm: 58 },
                  mx: "auto",
                  mb: 1,
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(180deg, #eef6ff 0%, #e3f2fd 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
                }}
              >
                {service.icon}
              </Box>

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 11.5, sm: 12.5, md: 13 },
                  lineHeight: 1.35,
                  color: "#1e293b",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  minHeight: { xs: 30, sm: 34 },
                  px: 0.3,
                }}
              >
                {title}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  </Box>
);
};

export default ServiceBoxGrid;
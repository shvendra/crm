import { Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const RatingStars = ({ rating = 0, size = 12, center = false }) => {
const value = +(4 + Math.random()).toFixed(1);

  return (
    <Box
      mt={0.5}
      display="flex"
      justifyContent={center ? "center" : "flex-start"}
      alignItems="center"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const fullStar = i + 1 <= Math.floor(value);
        const halfStar = value % 1 !== 0 && i + 1 === Math.ceil(value);

        return (
          <StarIcon
            key={i}
            sx={{
              fontSize: size,
              color: fullStar
                ? value >= 4
                  ? "#4caf50" // green for high rating
                  : "#ffc107" // yellow for normal
                : halfStar
                ? "#ffb300" // half star
                : "#e0e0e0", // empty
            }}
          />
        );
      })}
    </Box>
  );
};

export default RatingStars;

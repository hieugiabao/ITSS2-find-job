import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import Link from "next/link";
import { IUser } from "../../models/User";

interface MentorItemProps {
  data: IUser;
}

const MentorItem = ({ data }: MentorItemProps) => {
  return (
    <Link href={`/mentors/${data._id}`} className="w-[45%]">
      <Card
        sx={{ display: "flex" }}
        className="hover:bg-slate-50 transition-all"
      >
        <div className="overflow-hidden">
          <CardMedia
            component="img"
            sx={{ width: 120, height: 120, p: 1, borderRadius: 15 }}
            image={data.avatarUrl}
            alt="Live from space album cover"
            className="cursor-pointer hover:scale-105 transition duration-300 ease-in-out object-cover"
          />
        </div>

        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              {data.firstName} {data.lastName}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              className="mt-2"
            >
              {data.email}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Link>
  );
};

export default MentorItem;

import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import { IJob } from "../../models/Job";
import { ICompany } from "../../models/Company";
import { IAddress } from "../../models/Address";

interface JobItemProps {
  data: IJob;
}

const JobItem = ({ data }: JobItemProps) => {
  const company = data.company as ICompany;
  return (
    <Card sx={{ display: "flex" }} className="w-[32%]">
      <CardMedia
        component="img"
        sx={{ width: 151, p: 1 }}
        image={company.avatarUrl}
        alt="Live from space album cover"
      />
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {data.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            className="mt-2"
          >
            {company.companyName}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
            className="mt-3"
          >
            <span>{data.salary / 1e6} triệu</span>
            <span className="ml-10">{(data.address as IAddress).name}</span>
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default JobItem;

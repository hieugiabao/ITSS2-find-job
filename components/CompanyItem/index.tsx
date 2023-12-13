import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { ICompany } from "../../models/Company";

interface CompanyItemProps {
  data: ICompany;
}

const CompanyItem = ({ data }: CompanyItemProps) => {
  return (
    <Card sx={{ maxWidth: 300 }} className="w-[30%]">
      <CardActionArea>
        <CardMedia
          component="img"
          width={200}
          height="100"
          image={data.avatarUrl}
          alt="green iguana"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            className="text-center"
          >
            {data.companyName}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="text-center"
          >
            {data.address}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CompanyItem;

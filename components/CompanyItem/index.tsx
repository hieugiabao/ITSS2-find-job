import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { ICompany } from "../../models/Company";
import Link from "next/link";

interface CompanyItemProps {
  data: ICompany;
}

const CompanyItem = ({ data }: CompanyItemProps) => {
  return (
    <Card sx={{ maxWidth: 300 }} className="w-[30%]">
      <Link href={`/companies/${data._id}`} className="block">
        <CardActionArea>
          <CardMedia
            component="img"
            width={280}
            image={data.avatarUrl}
            alt="green iguana"
            className="h-48"
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
      </Link>
    </Card>
  );
};

export default CompanyItem;

import dbConnect from "@/dbConnect";
import CheckIcon from "@mui/icons-material/Check";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import Header from "../../components/Header";
import { getJobById, getRelatedJobById } from "../../lib/job.service";
import { ICompany } from "../../models/Company";
import { IJob } from "../../models/Job";
import { useRouter } from "next/router";

const RELATED_JOB_ITEMS = 2;

interface JobDetailProps {
  job: IJob;
  relatedJobs: IJob[];
}

const JobDetail = ({ job, relatedJobs }: JobDetailProps) => {
  const router = useRouter();
  const id = router.query.id;
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState("");
  const [relatedJobsData, setRelatedJobsData] = React.useState<IJob[]>(
    relatedJobs.slice(0, RELATED_JOB_ITEMS)
  );
  const company = job.company as ICompany;

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<number>();

  React.useEffect(() => {
    setRelatedJobsData(relatedJobs.slice(0, RELATED_JOB_ITEMS));
  }, [id]);

  React.useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 3000);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoadMoreRelatedJobs = () => {
    if (relatedJobsData.length < relatedJobs.length) {
      setRelatedJobsData(
        relatedJobs.slice(0, relatedJobsData.length + RELATED_JOB_ITEMS)
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="pt-[8rem] px-28 flex bg-gray-100 min-h-screen gap-9">
        <div className="w-[70%]">
          <Card sx={{ display: "flex" }} className="h-52">
            <CardMedia
              component="img"
              sx={{ width: 240, p: 1 }}
              image={company.avatarUrl}
              alt="Live from space album cover"
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h5">
                  {job.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-2"
                >
                  <span className="font-bold text-black">Địa chỉ: </span>{" "}
                  {company.address}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  className="mt-3"
                >
                  <span className="font-bold text-black">Mức lương:</span>{" "}
                  {job.salary / 1e6} triệu
                </Typography>
                <Link href={`/companies/${company._id}`}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    className="mt-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="inline-block mr-2"
                    >
                      <path
                        d="M11.5 8.5L19 1M19 1H14M19 1V6M19 12V17C19 17.5304 18.7893 18.0391 18.4142 18.4142C18.0391 18.7893 17.5304 19 17 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V3C1 2.46957 1.21071 1.96086 1.58579 1.58579C1.96086 1.21071 2.46957 1 3 1H8"
                        stroke="#00CEFC"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[#00CEFC] text-xl italic">
                      {company.companyName}
                    </span>
                  </Typography>
                </Link>
              </CardContent>
            </Box>
            <div className="flex-1 text-right">
              <Button
                style={{
                  background:
                    "linear-gradient(90deg, #ED57B0 0%, #FC6767 100%)",
                }}
                className="px-8 py-3 h-12 mt-8 mr-14"
                variant="contained"
                onClick={handleClickOpen}
              >
                Apply ngay
              </Button>
            </div>
          </Card>
          <div className="bg-white p-6 mt-6 mb-14 rounded shadow">
            {
              <div
                dangerouslySetInnerHTML={{
                  __html: String(job.description),
                }}
                className="prose prose-lg"
              />
            }
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white p-5 font-bold rounded">
            Việc làm đang tuyển dụng{" "}
            {relatedJobsData.length !== relatedJobs.length && (
              <span
                className="text-[#9A36FF] ml-4 cursor-pointer"
                onClick={handleLoadMoreRelatedJobs}
              >
                Xem thêm
              </span>
            )}
          </div>
          {relatedJobsData.length > 0 ? (
            <>
              {relatedJobsData.map((job) => (
                <Link href={`/jobs/${job._id}`} key={job._id}>
                  <Card
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: "10px",
                    }}
                    className="w-full mt-2"
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, p: 1 }}
                      image="https://image.bnews.vn/MediaUpload/Org/2019/03/04/151429_01.png"
                      alt="Live from space album cover"
                    />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography
                          component="div"
                          variant="h6"
                          className="text-base font-bold"
                        >
                          {job.title}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                        >
                          {(job.company as ICompany).companyName}{" "}
                        </Typography>
                        <div className="flex justify-between pr-6 w-3/4">
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                          >
                            {job.salary / 1e6} triệu
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="span"
                            className="truncate w-2/3 text-right"
                          >
                            {(job.company as ICompany).address}
                          </Typography>
                        </div>
                      </CardContent>
                    </Box>
                  </Card>
                </Link>
              ))}
            </>
          ) : (
            <div className="bg-white p-5 rounded">
              Không có việc làm nào liên quan
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-bold text-2xl">
          Ứng tuyển
          <div className="font-bold text-xl">{job.title}</div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="mb-4">
            {company.companyName}
          </DialogContentText>

          <div className="min-w-[496px]">
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <TextField
              fullWidth
              id="email"
              className="mt-2"
              placeholder="enter your email"
              sx={{ backgroundColor: "#D9D9D9" }}
            />
            <label htmlFor="" className="font-bold my-2 block">
              CV
            </label>
            <div>
              <input
                id="cv"
                className="mt-2"
                placeholder="CV1"
                type="file"
                hidden
                onChange={(e) => {
                  setFile(e.target.files?.[0]?.name || "");
                }}
              />
              <div className="flex gap-8">
                {file !== "" && (
                  <span className="font-bold cursor-pointer p-2 bg-[#D9D9D9] block w-[80px] rounded">
                    {file.length > 6 ? `${file.substring(0, 6)}...` : file}
                  </span>
                )}
                <label
                  htmlFor="cv"
                  className="font-bold cursor-pointer p-2 bg-[#D9D9D9] block w-[72px] rounded"
                >
                  Tải lên
                </label>
              </div>
            </div>
          </div>
          <hr className="mt-7" />
        </DialogContent>
        <DialogActions className="flex justify-around">
          <Button onClick={handleClose} className="bg-[#1E3EE9] text-white">
            Hủy
          </Button>
          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              variant="contained"
              className={`${success ? "bg-[#4cf75b]" : "bg-[#E91E63]"}`}
              sx={{
                backgroundColor: "",
              }}
              disabled={loading}
              onClick={handleButtonClick}
            >
              Apply
            </Button>
            {success && (
              <CheckIcon
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                  bgcolor: green[500],
                  borderRadius: "50%",
                }}
              />
            )}
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  await dbConnect();

  if (!params?.id)
    return {
      notFound: true,
    };
  const [job, relatedJobs] = await Promise.all([
    getJobById(String(params.id)),
    getRelatedJobById(String(params.id)),
  ]);

  if (!job)
    return {
      notFound: true,
    };

  return {
    props: {
      job: JSON.parse(JSON.stringify(job)),
      relatedJobs: JSON.parse(JSON.stringify(relatedJobs)),
    },
  };
};

export default JobDetail;

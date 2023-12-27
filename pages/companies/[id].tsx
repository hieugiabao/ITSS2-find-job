import CheckIcon from "@mui/icons-material/Check";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import Header from "../../components/Header";
import { ICompany } from "../../models/Company";
import dbConnect from "@/dbConnect";
import {
  checkIsLike,
  getCommnent,
  getDetailCompany,
  getTotalLike,
} from "../../lib/company.service";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import { ILike } from "../../models/Like";
import { IComment } from "../../models/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getJobsPaginated } from "../../lib/job.service";
import { PageResult } from "../../types";
import { IJob } from "../../models/Job";
import { useRouter } from "next/navigation";
import axios from "axios";

interface CompanyDetailProps {
  company: ICompany;
  totalLike: any;
  comments: IComment[];
  jobs: PageResult<IJob> | null;
  isLike: boolean;
}

const user = {
  username: "admin",
  avatarUrl:
    "https://musicart.xboxlive.com/7/4d4d6500-0000-0000-0000-000000000002/504/image.jpg?w=1920&h=1080",
  email: "thanhduong@mail.com",
  password: "$2a$12$Bo4xGIwqDh4lLWnEPSPBieQsXh3LF1AqK5WufrzdRLNcMqO3v6G1O",
  firstName: "Thanh",
  lastName: "Duong",
  address: 1,
  category: 2,
  description:
    "<h2>CẤP BẬC:</h2><ul><li>Senior Dev</li></ul><h2>M&Ocirc; TẢ:</h2><ul><li>2020-2022: Hacker l&agrave;m việc cho FBI</li><li>2022-2023: Ph&aacute;t triển AI Skynet</li></ul>",
  level: "middle",
  experience: 3,
  role: 3,
  _id: "65787da4577f298355d4adce",
  __v: 0,
};

const CompanyDetail = ({
  company,
  totalLike,
  comments,
  jobs,
  isLike,
}: CompanyDetailProps) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [anonymous, setAnonymous] = React.useState(0);
  const [likeCount, setLikeCount] = React.useState<number>(
    totalLike?.totalLike ?? 0
  );
  const commentCount = comments.length;
  const [commentData, setCommentData] = React.useState(comments.slice(0, 2));
  const timer = React.useRef<number>();
  const [feedBack, setFeedBack] = React.useState({
    comment: "",
    proofUrl: "",
  });
  const [userLiked, setUserLiked] = React.useState(isLike);

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = async () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      try {
        const res = await axios.post(`/api/companies/${company._id}/comment`, {
          ...feedBack,
          status: "cho duyet",
          company: company._id,
          anonymous,
          user,
        });
        if (res.data.success) {
          const newComment = res.data.data as IComment;
          comments.unshift(newComment);
          setCommentData((pre) => [newComment, ...pre]);
        }
        setSuccess(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setOpen(false);
        setSuccess(false);
      }
    }
  };

  const handleLoadMore = () => {
    if (commentData.length < commentCount) {
      setCommentData(comments.slice(0, commentData.length + 2));
    }
  };

  const handleLike = async () => {
    const newLikeCount = userLiked ? likeCount - 1 : likeCount + 1;
    setLikeCount(newLikeCount);
    setUserLiked(!userLiked);
    await axios.post(`/api/companies/${company._id}/like`, {
      user: user._id,
      company: company._id,
    });
  };

  return (
    <div>
      <Header />
      <div className="pt-20 px-28 flex bg-gray-100 min-h-screen gap-9">
        <div className="w-[70%]">
          <Box className="bg-white rounded p-7">
            <div className="flex">
              <div className="w-24 h-24 ">
                <img
                  src={company.avatarUrl}
                  alt="company ava"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-24 flex items-center text-2xl">
                {likeCount}{" "}
                <FavoriteIcon
                  className={`${
                    userLiked ? "text-[#FF0000]" : "text-black"
                  } cursor-pointer`}
                  onClick={handleLike}
                />
              </div>
            </div>
            <Typography
              component="div"
              variant="h5"
              className="text-gray-400 mt-3 text-base font-bold"
            >
              {company.companyName} company
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              className="mt-9 font-bold text-black"
            >
              <FmdGoodIcon className="mb-2" />
              {company.address}
            </Typography>
            <div className="mt-2">
              {
                <div
                  dangerouslySetInnerHTML={{
                    __html: String(company.description),
                  }}
                  className="prose prose-lg"
                />
              }
            </div>
          </Box>

          <div className="flex flex-wrap gap-10 justify-between mt-10">
            {jobs?.results.length && (
              <>
                {jobs.results.map((job) => (
                  <Card
                    sx={{ display: "flex" }}
                    className="w-[45%] mt-2 cursor-pointer"
                    key={job._id}
                    onClick={() => router.push(`/jobs/${job._id}`)}
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
                          Công ty {(job.company as ICompany).companyName}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                        >
                          {job.salary / 1e6} triệu{" "}
                          <span className="ml-4">
                            {(job.company as ICompany).address}
                          </span>
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="flex-1">
          {!!commentData.length && (
            <div className="bg-white font-bold rounded">
              {commentData.map((comment: any) => (
                <div key={comment._id}>
                  <div className="flex gap-7 px-4 pt-9 pb-5">
                    <Avatar
                      alt="Avatar"
                      src={comment.user.avatarUrl}
                      sx={{ width: 90, height: 90 }}
                    />
                    <div>
                      {comment.anonymous ? (
                        <div className="text-base font-bold">
                          {`${comment.user.firstName ?? ""} ${
                            comment.user.lastName ?? ""
                          }`}
                        </div>
                      ) : (
                        <div className="">**********</div>
                      )}
                      <p className="text-sm font-normal mt-6">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                  <hr className="h-[2px] bg-black" />
                </div>
              ))}
              {commentData.length !== comments.length && (
                <div
                  className="text-[#A234F8] text-sm text-center pt-6 pb-4 cursor-pointer"
                  onClick={handleLoadMore}
                >
                  Xem thêm...
                </div>
              )}
            </div>
          )}
          <Button
            style={{
              background: "linear-gradient(90deg, #ED57B0 0%, #FC6767 100%)",
            }}
            className="px-8 py-3 h-12 mt-8 mr-14"
            variant="contained"
            onClick={handleClickOpen}
          >
            Đánh giá
          </Button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-bold text-2xl">
          Đánh giá công ty
          <div className="my-2 text-base text-gray-400">
            Công ty {company.companyName}
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="min-w-[496px]">
            <label htmlFor="cmt" className="font-bold">
              Comment
            </label>
            <TextField
              fullWidth
              id="cmt"
              className="mt-2"
              placeholder="enter your comment"
              sx={{ backgroundColor: "#D9D9D9" }}
              onChange={(e) =>
                setFeedBack({
                  ...feedBack,
                  comment: e.target.value,
                })
              }
            />
            <label htmlFor="url" className="font-bold my-2 block">
              URL minh chứng
            </label>
            <TextField
              fullWidth
              id="url"
              className="mt-2"
              placeholder="enter your URL"
              sx={{ backgroundColor: "#D9D9D9" }}
              onChange={(e) =>
                setFeedBack({
                  ...feedBack,
                  proofUrl: e.target.value,
                })
              }
            />
          </div>
          <div className="mt-8">
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={anonymous}
                onChange={(e) => {
                  setAnonymous(+e.target.value);
                }}
              >
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label={<h1 className="font-bold">Ẩn danh</h1>}
                />
                <FormControlLabel
                  value="1"
                  control={<Radio />}
                  label={<h1 className="font-bold">Không ẩn danh</h1>}
                />
              </RadioGroup>
            </FormControl>
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
              Đánh giá
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
  const companyId = String(params.id);
  const totalLike = await getTotalLike(companyId);
  const company = await getDetailCompany(companyId);
  const comments = await getCommnent(companyId);
  const jobs = await getJobsPaginated(
    { page: 1, size: 4 },
    { company: companyId }
  );
  const isLike = await checkIsLike(companyId, user._id);

  if (!company)
    return {
      notFound: true,
    };

  return {
    props: {
      company: JSON.parse(JSON.stringify(company)),
      totalLike: JSON.parse(JSON.stringify(totalLike)),
      comments: JSON.parse(JSON.stringify(comments)),
      jobs: JSON.parse(JSON.stringify(jobs)),
      isLike,
    },
  };
};

export default CompanyDetail;

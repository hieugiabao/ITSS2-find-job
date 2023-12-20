import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { ICompany } from "../../models/Company";
import { IJob } from "../../models/Job";
import { SearchData } from "../../pages";
import CompanyItem from "../CompanyItem";
import Header from "../Header";
import JobItem from "../JobItem";

interface Props {
  jobData: IJob[];
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  companyData: ICompany[];
  setCompanyPage: Dispatch<SetStateAction<number>>;
  totalCompanyPages: number;
  searchData: SearchData;
  handleChange: (filer: string, value: string | number) => void;
  isError: boolean;
  isLoading: boolean;
}

const Home = ({
  jobData,
  setPage,
  totalPages,
  companyData,
  setCompanyPage,
  totalCompanyPages,
  searchData,
  handleChange,
  isError,
  isLoading,
}: Props) => {
  return (
    <>
      <Header />
      <main className="bg-gray-100 pt-[1px] min-h-screen">
        <div className="flex mx-28 gap-4 my-3">
          <div className="my-5 text-xl ">Việc làm mới nhất</div>
          <FormControl sx={{ m: 1, minWidth: 200, backgroundColor: "#fff" }}>
            <Select
              value={`${searchData.add}`}
              onChange={(e) => {
                handleChange("add", e.target.value);
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">Tất cả tỉnh / Thành phố</MenuItem>
              <MenuItem value={"1"}>Hà Nội</MenuItem>
              <MenuItem value={"2"}>Hồ Chí Minh</MenuItem>
              <MenuItem value={"3"}>Đà Nẵng</MenuItem>
              <MenuItem value={"4"}>Hải Phòng</MenuItem>
              <MenuItem value={"5"}>Cần Thơ</MenuItem>
              <MenuItem value={"6"}>Biên Hòa</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 200, backgroundColor: "#fff" }}>
            <Select
              value={`${searchData.sal}`}
              onChange={(e) => {
                handleChange("sal", e.target.value);
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">Tất cả mức lương</MenuItem>
              <MenuItem value={"0-10"}>Dưới 10 triệu</MenuItem>
              <MenuItem value={"11-20"}>10 - 20 triệu</MenuItem>
              <MenuItem value={"21-30"}>20 -30 triệu</MenuItem>
              <MenuItem value={"31-40"}>30 -40 triệu</MenuItem>
              <MenuItem value={"41-200"}>Trên 40 triệu</MenuItem>
              <MenuItem value={"0-200"}>Thỏa thuận</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 200, backgroundColor: "#fff" }}>
            <Select
              value={`${searchData.exp}`}
              onChange={(e) => {
                handleChange("exp", e.target.value);
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">Tất cả kinh nghiệm</MenuItem>
              <MenuItem value={"0-0"}>Chưa có kinh nghiệm</MenuItem>
              <MenuItem value={"0-1"}>Dưới 1 năm</MenuItem>
              <MenuItem value={"1-1"}>1 năm</MenuItem>
              <MenuItem value={"2-2"}>2 năm</MenuItem>
              <MenuItem value={"3-3"}>3 năm</MenuItem>
              <MenuItem value={"4-20"}>Trên 3 năm</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ m: 1, minWidth: 200, backgroundColor: "#fff" }}>
            <Select
              value={`${searchData.ind}`}
              onChange={(e) => {
                handleChange("ind", e.target.value);
              }}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="">Tất cả ngành nghề</MenuItem>
              <MenuItem value={"1"}>Sản xuất và chế biến</MenuItem>
              <MenuItem value={"2"}>Kiến trúc và xây dựng</MenuItem>
              <MenuItem value={"3"}>Kinh doanh</MenuItem>
              <MenuItem value={"4"}>Công nghệ - thông tin</MenuItem>
              <MenuItem value={"5"}>Luật - nhân văn</MenuItem>
              <MenuItem value={"6"}>Nghệ thuật - thẩm mỹ - đồ họa</MenuItem>
            </Select>
          </FormControl>
        </div>

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 12 }}>
            <CircularProgress />
          </Box>
        )}
        {isError && (
          <p>
            Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để biết thêm thông tin
            chi tiết
          </p>
        )}
        {!isLoading && !isError && (
          <>
            {/* job */}
            {jobData.length > 0 ? (
              <div className="w-full mx-auto">
                <div className="mx-28 flex flex-wrap gap-6 gap-y-10 mt-10">
                  {jobData.map((job) => (
                    <JobItem data={job} key={job._id} />
                  ))}
                </div>
                <div className="mt-6 w-full flex justify-center">
                  <Pagination
                    count={totalPages}
                    variant="text"
                    color="primary"
                    shape="rounded"
                    className="max-w-[350px]"
                    onChange={(_e, page) => setPage(page)}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full text-center text-3xl my-10">
                Không có công việc phù hợp
              </div>
            )}
            {/* company */}
            <div className="mx-28 flex flex-wrap gap-6 gap-y-10 mt-10">
              <h1 className="text-xl">Công ty hàng đầu</h1>
            </div>
            {companyData.length > 0 ? (
              <div className="w-full mx-auto">
                <div className="mx-28 flex flex-wrap gap-20 gap-y-10 mt-10 justify-center">
                  {companyData.map((company) => (
                    <CompanyItem data={company} key={company._id} />
                  ))}
                </div>
                <div className="mt-20 pb-80 w-full flex justify-center">
                  <Pagination
                    count={totalCompanyPages}
                    variant="text"
                    color="primary"
                    shape="rounded"
                    className="max-w-[350px]"
                    onChange={(_e, page) => setCompanyPage(page)}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full text-center text-3xl my-10">
                Không có công ty phù hợp
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Home;

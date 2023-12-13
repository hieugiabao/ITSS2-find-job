import { GetServerSideProps } from "next";
import dbConnect from "../lib/dbConnect";
import Home from "../components/Home";
import { useCallback, useEffect, useState } from "react";
import { IJob } from "../models/Job";
import axios from "axios";
import { ICompany } from "../models/Company";
import { useDebounce } from "use-debounce";

type Props = {
  isConnected: boolean;
};

export type SearchData = {
  q: string;
  add: string;
  ind: string;
  exp: string;
  sal: string;
};

const Index = ({ isConnected }: Props) => {
  const [jobData, setJobData] = useState<IJob[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const [companyData, setCompanyData] = useState<ICompany[]>([]);
  const [totalCompanyPages, setTotalCompanyPages] = useState(0);
  const [companyPage, setCompanyPage] = useState(1);

  // filter
  const [searchData, setSearchData] = useState<SearchData>({
    q: "",
    add: "",
    ind: "",
    exp: "",
    sal: "",
  });

  useCallback(async () => {}, []);

  const handleChange = (filer: string, value: string | number) => {
    console.log("filer", filer);
    setSearchData({
      ...searchData,
      [filer]: value,
    });
  };

  const fetchData = useCallback(async () => {
    try {
      const apiUrl = "/api/jobs";
      const res = await axios.get(apiUrl, {
        params: {
          ...searchData,
          page,
        },
      });
      const data = res.data;
      if (data.success) {
        setJobData(data.data.results);
        setTotalPages(data.data.totalPages);
      }
    } catch (error) {
      console.error(error);
    }
  }, [page, searchData]);

  const fetchCompanyData = useCallback(async () => {
    try {
      const apiUrl = "/api/companies";
      const res = await axios.get(apiUrl, {
        params: {
          ...searchData,
          page: companyPage,
        },
      });
      const data = res.data;
      if (data.success) {
        setCompanyData(data.data.results);
        setTotalCompanyPages(data.data.totalPages);
      }
    } catch (error) {
      console.error(error);
    }
  }, [companyPage, searchData]);

  useEffect(() => {
    fetchData();
    fetchCompanyData();
  }, [fetchData, fetchCompanyData]);

  return (
    <Home
      jobData={jobData}
      setPage={setPage}
      totalPages={totalPages}
      companyData={companyData}
      setCompanyPage={setCompanyPage}
      totalCompanyPages={totalCompanyPages}
      searchData={searchData}
      handleChange={handleChange}
    />
  );
};

/* Trying connect to mongodb */
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    await dbConnect();

    return { props: { isConnected: true } };
  } catch (err) {
    console.log(err);
    return { props: { isConnected: false } };
  }
};

export default Index;

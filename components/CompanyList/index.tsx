import React, { useEffect, useState } from "react";
import { ICompany } from "../../models/Company";
import CompanyItem from "../CompanyItem";

type Props = {
  companies: ICompany[];
  emptyMessage?: string;
};

const SIZE = 3;

const CompanyList: React.FC<Props> = ({ companies, emptyMessage }) => {
  const [companyData, setCompanyData] = useState<ICompany[]>(companies);

  const handleLoadMore = () => {
    if (companyData.length === companies.length) return;
    setCompanyData(companies.slice(0, companyData.length + SIZE));
  };

  useEffect(() => {
    setCompanyData(companies.slice(0, SIZE));
  }, [companies]);

  return (
    <>
      {companyData.length > 0 ? (
        <div className="flex justify-around items-center flex-wrap gap-10">
          {companyData.map((company) => (
            <CompanyItem key={company._id} data={company} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500 text-xl">{emptyMessage}</p>
        </div>
      )}

      {companyData.length !== companies.length && (
        <div
          className="flex justify-center text-xl items-center mt-5 cursor-pointer text-[#A234F8]"
          onClick={handleLoadMore}
        >
          Xem thêm...
        </div>
      )}
    </>
  );
};

export default CompanyList;

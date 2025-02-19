import React from "react";

const PageHeader = ({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) => {
  return (
    <section className="flex items-start md:items-center gap-3 md:flex-row flex-col  justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-display font-semibold">{title}</h1>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      {actions && (
        <div className="flex w-full md:w-fit justify-end md:justify-center items-center">
          {actions}
        </div>
      )}
    </section>
  );
};

export default PageHeader;

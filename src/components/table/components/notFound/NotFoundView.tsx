function NotFoundView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center my-14 tablet:my-20">
      {/* <Image
        alt='Mulher ilustrada debruçada sobre um campo de pesquisa'
        src='/images/vector-no-results-found.svg'
        priority
        width={347}
        height={253}
      /> */}
      <p className="mt-6 text-center text-base font-bold text-content-secondary">
        Nenhum resultado encontrado.
      </p>
    </div>
  );
}

export default NotFoundView;

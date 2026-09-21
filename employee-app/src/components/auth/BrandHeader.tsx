import logoAsset from "../../assets/logo.png";

function BrandHeader() {
  return (
    <header className="flex w-full items-center p-4">
      <img
        src={logoAsset}
        alt="iOneSoft Solutions"
        className="h-13 w-13 object-contain"
      />
    </header>
  );
}

export default BrandHeader;

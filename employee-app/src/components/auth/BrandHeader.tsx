const logoAsset =
  "https://www.figma.com/api/mcp/asset/81c34aee-0996-4374-a0d1-c14d9b2c86ee.png";

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

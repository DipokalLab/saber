import { ArrowUpRight } from "lucide-react";

export type AssetLicense = {
  name: string;
  url: string;
  license: string;
};

export const assetLicenses: AssetLicense[] = [
  {
    name: "Temple Ruins Asset Pack",
    url: "https://sketchfab.com/3d-models/temple-ruins-asset-pack-d1e25cdbe51e467a87baf94ead0afa63#download",
    license: "CC BY 4.0",
  },
];

export function AssetLicenseList() {
  return (
    <div className="space-y-2">
      {assetLicenses.map((asset) => (
        <a
          key={asset.name}
          href={asset.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 border rounded-md transition-colors hover:bg-muted/50"
        >
          <div className="font-semibold">{asset.name}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {asset.license}
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </a>
      ))}
    </div>
  );
}

import svgPaths from "./svg-11znh9i5x9";

function TopPart() {
  return (
    <div className="h-[151.364px] relative shrink-0 w-[1200px]" data-name="Top Part">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1200 151.364">
        <g id="Top Part">
          <path d={svgPaths.p24f30200} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p11ebcb80} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p284fe2c0} fill="var(--fill-0, black)" id="Vector_3" />
          <path d={svgPaths.p3faf6300} fill="var(--fill-0, black)" id="Vector_4" />
          <path d={svgPaths.p23fe8f80} fill="var(--fill-0, black)" id="Vector_5" />
          <path d={svgPaths.pa67bd00} fill="var(--fill-0, #FEFFFE)" id="Vector_6" />
          <path d={svgPaths.p1484b180} fill="var(--fill-0, black)" id="Vector_7" />
          <path clipRule="evenodd" d={svgPaths.p162fd700} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector_8" />
          <path d={svgPaths.p209a2d00} fill="var(--fill-0, black)" id="Vector_9" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-black h-[214px] overflow-clip relative shrink-0 w-full">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Helvetica_Neue:Bold',sans-serif] h-[214px] justify-center leading-[0] left-1/2 not-italic text-[170px] text-center text-white top-[calc(50%-0.36px)] tracking-[17px] w-[1200px]">
        <p className="leading-[normal]">LAUNDRY</p>
      </div>
    </div>
  );
}

export default function Op() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[32px] items-start pt-[32px] relative size-full" data-name="OP 2">
      <TopPart />
      <Frame />
    </div>
  );
}
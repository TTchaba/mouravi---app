import React, { useState, useMemo } from "react";
import {
  Leaf,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Layers,
  Beef,
  Droplets,
  Sun,
  Waves,
  Sprout,
  Clover,
  PiggyBank,
  Bird,
  Calculator,
  Milk,
  Coins,
  ArrowUpRight,
  CheckCircle2,
  RotateCcw,
  Flower2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Local animal icons (the installed lucide build does not export Cow/Sheep) */
/* ------------------------------------------------------------------ */
function Cow({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 10h14" />
      <path d="M7 10V8a3 3 0 0 1 6 0v2" />
      <path d="M13 10V8a3 3 0 0 1 6 0v2" />
      <path d="M7 10v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6" />
      <path d="M9 16v3" />
      <path d="M15 16v3" />
      <path d="M6 14h12" />
    </svg>
  );
}

function SheepIcon({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 10a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1h1a2 2 0 1 1 0 4h-1v1a2 2 0 0 1-4 0v-1H10v1a2 2 0 0 1-4 0v-1H5a2 2 0 1 1 0-4h1z" />
      <path d="M10 8h4" />
      <path d="M9 14h6" />
      <path d="M9 11h6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Mock calculation engine                                            */
/* -/* -----------------------------------------------------------------
   Crop Database
   Base yield = საშუალო მოსავლიანობა (კგ/ჰა)
----------------------------------------------------------------- */

const CROP_DB = {
  almond: {
    name_ge: "ნუში",
    base_yield_kg_ha: 1800,
    intensive_multiplier: 1.35,
    price_gel_kg: 6.5,
    unit: "კგ (ნაჭუჭიანი)",
  },

  pistachio: {
    name_ge: "ფისტა",
    base_yield_kg_ha: 1200,
    intensive_multiplier: 1.3,
    price_gel_kg: 18.0,
    unit: "კგ",
  },

  hazelnut: {
    name_ge: "თხილი",
    base_yield_kg_ha: 2500,
    intensive_multiplier: 1.28,
    price_gel_kg: 6.0,
    unit: "კგ",
  },

  walnut: {
    name_ge: "კაკალი (ჩანდლერი)",
    base_yield_kg_ha: 3500,
    intensive_multiplier: 1.32,
    price_gel_kg: 7.0,
    unit: "კგ",
  },

  peach: {
    name_ge: "ატამი",
    base_yield_kg_ha: 18000,
    intensive_multiplier: 1.2,
    price_gel_kg: 1.5,
    unit: "კგ",
  },

  tkemali: {
    name_ge: "ტყემალი",
    base_yield_kg_ha: 10000,
    intensive_multiplier: 1.18,
    price_gel_kg: 1.2,
    unit: "კგ",
  },

  lavender: {
    name_ge: "ლავანდა",
    base_yield_kg_ha: 2500,
    intensive_multiplier: 1.25,
    price_gel_kg: 10.0,
    unit: "კგ (მშრალი ყვავილი)",
  },

  asparagus: {
    name_ge: "სატაცური",
    base_yield_kg_ha: 5000,
    intensive_multiplier: 1.3,
    price_gel_kg: 15.0,
    unit: "კგ",
  },

  potato: {
    name_ge: "კარტოფილი",
    base_yield_kg_ha: 22000,
    intensive_multiplier: 1.22,
    price_gel_kg: 1.0,
    unit: "კგ",
  },

  strawberry: {
    name_ge: "მარწყვი",
    base_yield_kg_ha: 7000,
    intensive_multiplier: 1.4,
    price_gel_kg: 6.0,
    unit: "კგ",
  },
};

const REGION_FACTOR = {
  "კახეთი": 1.08,
  "იმერეთი": 0.95,
  "შიდა ქართლი": 1.0,
  "სამეგრელო": 0.9,
};

const CONDITION_FACTOR = {
  "მშრალი": 0.7,
  "საშუალო": 1.0,
  "ჭარბტენიანი": 0.85,
  "ირიგირებული": 1.35,
};

const ANIMAL_PROFILE = {
  "მსხვილფეხა რქოსანი/ხბო": {
    icon: Beef,
    perHectare: 1.1,
    unit: "სული",
    yieldLabel: "სავარაუდო რძის გამოსავლიანობა",
    yieldUnit: "ლიტრი",
    yieldPerHead: 2000,
    pricePerYieldUnit: 0.9,
  },
  "ღორი": {
    icon: PiggyBank,
    perHectare: 2.4,
    unit: "სული",
    yieldLabel: "სავარაუდო ხორცის გამოსავლიანობა",
    yieldUnit: "კგ",
    yieldPerHead: 95,
    pricePerYieldUnit: 9.5,
  },
  "ცხვარი/თხა": {
    icon: Clover,
    perHectare: 6.5,
    unit: "სული",
    yieldLabel: "სავარაუდო ხორცის გამოსავლიანობა",
    yieldUnit: "კგ",
    yieldPerHead: 22,
    pricePerYieldUnit: 11,
  },
  "ფრინველი": {
    icon: Bird,
    perHectare: 180,
    unit: "სული",
    yieldLabel: "სავარაუდო ხორცის გამოსავლიანობა",
    yieldUnit: "კგ",
    yieldPerHead: 2.1,
    pricePerYieldUnit: 7.2,
  },
};

function computeCropResults({ area, region, crop, irrigation, soilQuality }) {
  const a = Number(area) || 0;
  const cropData = CROP_DB[crop];

  if (!cropData) {
    return { suitability: 0, totalYield: 0, revenue: 0 };
  }

  const regionFactor = REGION_FACTOR[region] ?? 1;
  const soilFactor = Math.max(0.4, Math.min(1.2, soilQuality / 5));
  const irrigationFactor = irrigation ? (cropData.intensive_multiplier ?? 1.2) : 1;

  const suitabilityScore = Math.min(
    1.35,
    regionFactor * 0.45 + soilFactor * 0.35 + (irrigation ? 0.2 : 0)
  );

  const adjustedYieldPerHaKg = cropData.base_yield_kg_ha * suitabilityScore * irrigationFactor;
  const totalYieldTons = (a * adjustedYieldPerHaKg) / 1000;
  const revenue = totalYieldTons * 1000 * cropData.price_gel_kg;
  const suitability = Math.min(100, Math.round(suitabilityScore * 100));

  return {
    suitability,
    totalYield: totalYieldTons,
    revenue,
  };
}
function computeResults({ area, region, condition, animal }) {
  const a = Number(area) || 0;
  const profile = ANIMAL_PROFILE[animal];
  const regionF = REGION_FACTOR[region] ?? 1;
  const condF = CONDITION_FACTOR[condition] ?? 1;

  const capacity = Math.round(a * profile.perHectare * regionF * condF);
  const totalYield = Math.round(capacity * profile.yieldPerHead);
  const revenue = Math.round(totalYield * profile.pricePerYieldUnit);

  return { capacity, totalYield, revenue, profile };
}

function formatNum(n) {
  return new Intl.NumberFormat("ka-GE").format(Math.round(n));
}

/* ------------------------------------------------------------------ */
/*  Small UI atoms                                                     */
/* ------------------------------------------------------------------ */

function Pill({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
          : "border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:bg-emerald-50",
      ].join(" ")}
    >
      {Icon && <Icon size={16} strokeWidth={2.25} />}
      {children}
    </button>
  );
}

function FieldLabel({ children, icon: Icon }) {
  return (
    <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-stone-700">
      {Icon && <Icon size={15} className="text-emerald-700" />}
      {children}
    </label>
  );
}

function MetricCard({ icon: Icon, label, value, unit, boosted, accent }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-500",
        boosted
          ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white shadow-emerald-200/60"
          : "border-stone-200 bg-white",
      ].join(" ")}
    >
      <div
        className={[
          "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl",
          accent,
        ].join(" ")}
      >
        <Icon size={20} className="text-white" strokeWidth={2.25} />
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <p
        className={[
          "mt-1 text-2xl font-bold tabular-nums transition-colors duration-500",
          boosted ? "text-emerald-700" : "text-stone-800",
        ].join(" ")}
      >
        {value}{" "}
        <span className="text-sm font-medium text-stone-400">{unit}</span>
      </p>
      {boosted && (
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
          <ArrowUpRight size={12} /> +30%
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Action plan data                                                    */
/* ------------------------------------------------------------------ */

const LIVESTOCK_ACTION_STEPS = [
  {
    title: "ნიადაგის გაუმჯობესება და შემოღობვა",
    desc: "დაიცავი საძოვარი არასწორი ექსპლუატაციისგან და გაზარდე მისი ხანგრძლივობა მართვადი შემოღობვით.",
    cta: "შეიძინე ელ. ღობე ფასდაკლებით",
  },
  {
    title: "ვეტერინარის / აგრონომის კონსულტაცია",
    desc: "მიიღე პროფესიონალის შეფასება ფარის ჯანმრთელობაზე და საძოვრის ნიადაგის ხარისხზე.",
    cta: "დაჯავშნე ვიზიტი",
  },
  {
    title: "ტექნოლოგიური აღჭურვა",
    desc: "გაზარდე ეფექტურობა შესაბამისი ტექნიკით — სარწყავი სისტემები, საკალათე და სატრანსპორტო აღჭურვილობა.",
    cta: "ტექნიკის ლიზინგი",
  },
];

const ARABLE_ACTION_STEPS = [
  {
    title: "აგრონომის კონსულტაცია",
    desc: "მიიღე პროფესიონალის შეფასება ნიადაგის ხარისხზე და კულტურის შესაბამისობის შესახებ.",
    cta: "დაჯავშნე ვიზიტი",
  },
  {
    title: "ტექნოლოგიური აღჭურვა",
    desc: "გააუმჯობესე მოსავლიანობა შესაბამისი მიწათმოქმედებითი ტექნიკით და სარწყავი სისტემით.",
    cta: "ტექნიკის ლიზინგი",
  },
  {
    title: "ფერმის კულტურების მართვა",
    desc: "შექმენი პერსონალური კალენდარი, განთავისუფლებული რეკომენდაციებით და მოსავალიანი სტრატეგიით.",
    cta: "გახსენი აგროგეგმა",
  },
];

/* ------------------------------------------------------------------ */
/*  Main App                                                            */
/* ------------------------------------------------------------------ */

export default function App() {
  const [step, setStep] = useState("onboarding"); // onboarding | form | results
  const [path, setPath] = useState(null); // "livestock" | "arable"

  const [area, setArea] = useState("");
  const [region, setRegion] = useState("კახეთი");
  const [condition, setCondition] = useState("საშუალო");
  const [animal, setAnimal] = useState("მსხვილფეხა რქოსანი/ხბო");
  const [crop, setCrop] = useState("almond");
  const [irrigation, setIrrigation] = useState(false);
  const [soil, setSoil] = useState(3);

  const [results, setResults] = useState(null);
  // Arable (crop) results computed only when user clicks Calculate
  const [arableResults, setArableResults] = useState(null);
  const [rotational, setRotational] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  const base = useMemo(() => {
    if (!results) return null;
    return results;
  }, [results]);

  const display = useMemo(() => {
    if (!base) return null;
    const factor = rotational ? 1.3 : 1;
    return {
      capacity: Math.round(base.capacity * factor),
      totalYield: Math.round(base.totalYield * factor),
      revenue: Math.round(base.revenue * factor),
    };
  }, [base, rotational]);

  const selectedCropName = CROP_DB[crop]?.name_ge || crop;

  function handleCalculate() {
    const r = computeResults({
      area: area || 10,
      region,
      condition,
      animal,
    });
    setResults(r);
    setRotational(false);
    setShowPlan(false);
    setStep("results");
  }

  function handleCalculateArable() {
    const r = computeCropResults({
      area: area || 10,
      region,
      crop,
      irrigation,
      soilQuality: soil,
    });
    setArableResults(r);
    setStep("results");
  }

  const activeActionSteps = path === "arable" ? ARABLE_ACTION_STEPS : LIVESTOCK_ACTION_STEPS;

  function resetAll() {
    setStep("onboarding");
    setPath(null);
    setResults(null);
    setArableResults(null);
    setShowPlan(false);
  }

  return (
    <div className="min-h-screen w-full bg-[#FAF7F1] font-agronomy text-stone-800">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-7 sm:max-w-lg">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <button
            onClick={resetAll}
            className="flex items-center gap-2.5"
            aria-label="დაბრუნება დასაწყისში"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 shadow-md shadow-emerald-900/20">
              <Sprout size={20} className="text-white" strokeWidth={2.5} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-stone-800">
              Mouravi
            </span>
          </button>
          {step !== "onboarding" && (
            <button
              onClick={resetAll}
              className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 hover:border-stone-300"
            >
              <RotateCcw size={13} /> ახლიდან
            </button>
          )}
        </header>

        {/* ---------------- ONBOARDING ---------------- */}
        {step === "onboarding" && (
          <div className="flex flex-1 flex-col">
            <div className="mb-7">
              <h1 className="text-[26px] font-extrabold leading-tight text-stone-800">
                გამოთვალე შენი მიწის
                <br />
                <span className="text-emerald-700">სრული პოტენციალი</span>
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                შეარჩიე მიმართულება და მიიღე ანალიტიკა შემოსავლის,
                გამოსავლიანობისა და საჭირო რესურსების შესახებ — წამებში.
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <button
                onClick={() => {
                  setPath("livestock");
                  setStep("form");
                }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 transition-colors group-hover:bg-emerald-600">
                  <Beef
                    size={26}
                    className="text-emerald-700 transition-colors group-hover:text-white"
                    strokeWidth={2}
                  />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-stone-800">
                    საძოვარი და მეცხოველეობა
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    ტევადობა, რძე/ხორცის გამოსავლიანობა, შემოსავალი
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600"
                />
              </button>

              <button
                onClick={() => {
                  setPath("arable");
                  setStep("form");
                }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-lg"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-600">
                  <Leaf
                    size={26}
                    className="text-amber-700 transition-colors group-hover:text-white"
                    strokeWidth={2}
                  />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-stone-800">
                    სახნავი და მემცენარეობა
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    მოსავლიანობა, კულტურის შერჩევა, საბაზრო ღირებულება
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-amber-600"
                />
              </button>
            </div>

            <p className="mt-8 text-center text-[11px] text-stone-400">
              * მონაცემები საილუსტრაციოა — Mouravi-ს ჯერ არ აქვს ცოცხალი
              ბაზა.
            </p>
          </div>
        )}

        {/* ---------------- FORM (livestock) ---------------- */}
        {step === "form" && path === "livestock" && (
          <div className="flex flex-1 flex-col">
            <button
              onClick={() => setStep("onboarding")}
              className="mb-4 flex w-fit items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-700"
            >
              <ChevronLeft size={14} /> უკან
            </button>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-stone-800">
                საძოვრის მონაცემები
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                შეავსე ველები გაანგარიშებისთვის

              </p>
            </div>

            <div className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              {/* area */}
              <div>
                <FieldLabel icon={Layers}>ფართობი (ჰექტარი)</FieldLabel>
                <input
                  type="number"
                  min="0"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="10"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* region */}
              <div>
                <FieldLabel icon={MapPin}>რეგიონი</FieldLabel>
                <div className="relative">
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  >
                    {Object.keys(REGION_FACTOR).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <ChevronRight
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-stone-400"
                  />
                </div>
              </div>

              {/* condition */}
              <div>
                <FieldLabel icon={Droplets}>საძოვრის მდგომარეობა</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  <Pill
                    icon={Sun}
                    active={condition === "მშრალი"}
                    onClick={() => setCondition("მშრალი")}
                  >
                    მშრალი
                  </Pill>
                  <Pill
                    icon={Layers}
                    active={condition === "საშუალო"}
                    onClick={() => setCondition("საშუალო")}
                  >
                    საშუალო
                  </Pill>
                  <Pill
                    icon={Waves}
                    active={condition === "ჭარბტენიანი"}
                    onClick={() => setCondition("ჭარბტენიანი")}
                  >
                    ჭარბტენიანი
                  </Pill>
                  <Pill
                    icon={Droplets}
                    active={condition === "ირიგირებული"}
                    onClick={() => setCondition("ირიგირებული")}
                  >
                    ირიგირებული
                  </Pill>
                </div>
              </div>

              {/* category */}
              <div>
                <FieldLabel icon={Beef}>კატეგორია</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ANIMAL_PROFILE).map(([name, p]) => {
                    const Icon = p.icon;
                    const active = animal === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setAnimal(name)}
                        className={[
                          "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center text-xs font-semibold transition-all",
                          active
                            ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
                            : "border-stone-200 bg-stone-50 text-stone-600 hover:border-emerald-300",
                        ].join(" ")}
                      >
                        <Icon size={20} strokeWidth={2} />
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-4 text-base font-bold text-white shadow-lg shadow-emerald-900/25 transition-all hover:bg-emerald-800 active:scale-[0.98]"
            >
              <Calculator size={19} /> გამოთვლა
            </button>
          </div>
        )}

        {/* ---------------- FORM (arable REAL MCDA) ---------------- */}
{step === "form" && path === "arable" && (
  <div className="flex flex-1 flex-col">
    <button
      onClick={() => setStep("onboarding")}
      className="mb-4 flex w-fit items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-700"
    >
      <ChevronLeft size={14} /> უკან
    </button>

    <div className="mb-5">
      <h2 className="text-xl font-bold text-stone-800">
        ნაკვეთის მონაცემები
      </h2>
      <p className="mt-1 text-sm text-stone-500">
        შეავსე ველები გაანგარიშებისთვის
      </p>
    </div>

    {/* INPUT CARD */}
    <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">

      {/* area */}
      <div>
        <FieldLabel icon={Layers}>ფართობი (ჰექტარი)</FieldLabel>
        <input
          type="number"
          min="0"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="10"
          className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* region */}
      <div>
        <FieldLabel icon={MapPin}>რეგიონი</FieldLabel>
        <div className="relative">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          >
            {Object.keys(REGION_FACTOR).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <ChevronRight
            size={16}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-stone-400"
          />
        </div>
      </div>

      {/* soil */}
      <div>
        <label className="text-sm font-semibold">
          ნიადაგის ნაყოფიერება (1-5)
        </label>
        <select
          value={soil}
          onChange={(e) => setSoil(Number(e.target.value))}
          className="mt-1 w-full rounded-xl border p-3"
        >
          <option value={1}>1 - დაბალი</option>
          <option value={2}>2</option>
          <option value={3}>3 - საშუალო</option>
          <option value={4}>4</option>
          <option value={5}>5 - მაღალი</option>
        </select>
      </div>

      {/* irrigation */}
      <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
        <span className="text-sm font-semibold text-stone-700">სარწყავი სისტემა</span>
        <button
          type="button"
          onClick={() => setIrrigation(!irrigation)}
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
            irrigation
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-stone-300 bg-white text-transparent"
          }`}
          aria-pressed={irrigation}
        >
          <CheckCircle2 size={16} />
        </button>
      </div>

      {/* crop */}
      <div>
        <FieldLabel icon={Flower2}>კულტურა</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(CROP_DB).map(([key, data]) => {
            const active = crop === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCrop(key)}
                className={[
                  "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center text-xs font-semibold transition-all",
                  active
                    ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:border-emerald-300",
                ].join(" ")}
              >
                {data.name_ge}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleCalculateArable}
        className="mt-3 w-full rounded-2xl bg-emerald-700 py-3 text-sm font-bold text-white shadow transition-all hover:bg-emerald-800 active:scale-[0.98]"
      >
        გამოთვლა
      </button>
    </div>

  </div>
)}
        {/* ---------------- RESULTS ---------------- */}
        {step === "results" && (
          <div className="flex flex-1 flex-col">
            <button
              onClick={() => {
                setStep("form");
                setShowPlan(false);
              }}
              className="mb-4 flex w-fit items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-700"
            >
              <ChevronLeft size={14} /> პარამეტრების შეცვლა
            </button>

            <div className="mb-5">
              <h2 className="text-xl font-bold text-stone-800">
                {path === "arable" ? "მემცენარეობის პოტენციალი" : "შენი საძოვრის პოტენციალი"}
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                {path === "arable"
                  ? `${area || 10} ჰა · ${region} · ${selectedCropName}`
                  : `${area || 10} ჰა · ${region} · ${animal}`}
              </p>
            </div>

            {path === "arable" && arableResults ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600">
                    <Leaf size={20} className="text-white" strokeWidth={2.25} />
                  </div>
                  <p className="text-xs text-stone-500">სავარაუდო მოსავალი</p>
                  <p className="text-xl font-bold">
                    {formatNum(arableResults.totalYield)}
                    <span className="ml-1 text-sm font-medium text-stone-400">ტონა</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600">
                    <Coins size={20} className="text-white" strokeWidth={2.25} />
                  </div>
                  <p className="text-xs text-stone-500">პოტენციური შემოსავალი</p>
                  <p className="text-xl font-bold text-amber-600">
                    {formatNum(arableResults.revenue)}
                    <span className="ml-1 text-sm font-medium text-stone-400">ლარი</span>
                  </p>
                </div>

                {!showPlan && (
                  <button
                    onClick={() => setShowPlan(true)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-700 bg-white py-4 text-base font-bold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 active:scale-[0.98]"
                  >
                    იხილე სამოქმედო გეგმა <ChevronRight size={18} />
                  </button>
                )}

                {showPlan && (
                  <div className="mt-6">
                    <h3 className="mb-3 text-base font-bold text-stone-800">
                      სამოქმედო გეგმა
                    </h3>
                    <div className="flex flex-col gap-3">
                      {activeActionSteps.map((s, i) => {
                        return (
                          <div
                            key={s.title}
                            className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                          >
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs font-bold text-stone-500">
                                {i + 1}
                              </span>
                              <div className="flex-1">
                                <div className="mb-1">
                                  <p className={"text-sm " + (path === "livestock" ? "font-semibold" : "font-bold") + " text-stone-800"}>
                                    {s.title}
                                  </p>
                                </div>
                                <p className="text-xs leading-relaxed text-stone-500">
                                  {s.desc}
                                </p>
                                <button className="mt-3 rounded-lg bg-stone-800 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700">
                                  {s.cta}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                      <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                      გეგმის შესრულებით შესაძლებელია პოტენციური გამომუშავების ზრდა
                      15–30%-ით.
                    </div>
                  </div>
                )}
              </div>
            ) : (
              display && (
                <>
                  {/* Rotational toggle */}
                  <div className="mb-5 flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                          rotational ? "bg-emerald-600" : "bg-stone-100",
                        ].join(" ")}
                      >
                        <RotateCcw
                          size={18}
                          className={rotational ? "text-white" : "text-stone-400"}
                        />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-stone-800">
                          როტაციული ძოვება
                        </p>
                        <p className="text-xs text-stone-500">
                          ჭკვიანი მართვით — მეტი ტევადობა, ნაკლები ეროზია
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setRotational((v) => !v)}
                      aria-pressed={rotational}
                      className={[
                        "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300",
                        rotational ? "bg-emerald-600" : "bg-stone-300",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300",
                          rotational ? "translate-x-[22px]" : "translate-x-0.5",
                        ].join(" ")}
                      />
                    </button>
                  </div>

                  {/* Metric cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <MetricCard
                        icon={Beef}
                        accent="bg-emerald-600"
                        label="მაქსიმალური ტევადობა"
                        value={formatNum(display.capacity)}
                        unit={base.profile.unit}
                        boosted={rotational}
                      />
                    </div>
                    <MetricCard
                      icon={Milk}
                      accent="bg-sky-600"
                      label={base.profile.yieldLabel}
                      value={formatNum(display.totalYield)}
                      unit={base.profile.yieldUnit}
                      boosted={rotational}
                    />
                    <MetricCard
                      icon={Coins}
                      accent="bg-amber-600"
                      label="პოტენციური შემოსავალი"
                      value={formatNum(display.revenue)}
                      unit="₾"
                      boosted={rotational}
                    />
                  </div>

                  {/* Action plan trigger */}
                  {!showPlan && (
                    <button
                      onClick={() => setShowPlan(true)}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-700 bg-white py-4 text-base font-bold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 active:scale-[0.98]"
                    >
                      იხილე სამოქმედო გეგმა <ChevronRight size={18} />
                    </button>
                  )}

                  {/* Action plan */}
                  {showPlan && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-base font-bold text-stone-800">
                        სამოქმედო გეგმა
                      </h3>
                      <div className="flex flex-col gap-3">
                        {activeActionSteps.map((s, i) => {
                          return (
                            <div
                              key={s.title}
                              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                            >
                              <div className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs font-bold text-stone-500">
                                  {i + 1}
                                </span>
                                <div className="flex-1">
                                  <div className="mb-1">
                                    <p className="text-sm font-bold text-stone-800">
                                      {s.title}
                                    </p>
                                  </div>
                                  <p className="text-xs leading-relaxed text-stone-500">
                                    {s.desc}
                                  </p>
                                  <button className="mt-3 rounded-lg bg-stone-800 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700">
                                    {s.cta}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                        <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                        გეგმის შესრულებით შესაძლებელია ტევადობის ზრდა საშუალოდ
                        20–35%-ით.
                      </div>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// /* ------------------------------------------------------------------ */
// /*  Small UI atoms                                                     */
// /* ------------------------------------------------------------------ */

// function Pill({ active, onClick, icon: Icon, children }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={[
//         "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200",
//         active
//           ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
//           : "border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:bg-emerald-50",
//       ].join(" ")}
//     >
//       {Icon && <Icon size={16} strokeWidth={2.25} />}
//       {children}
//     </button>
//   );
// }

// function FieldLabel({ children, icon: Icon }) {
//   return (
//     <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-stone-700">
//       {Icon && <Icon size={15} className="text-emerald-700" />}
//       {children}
//     </label>
//   );
// }

// function MetricCard({ icon: Icon, label, value, unit, boosted, accent }) {
//   return (
//     <div
//       className={[
//         "relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-500",
//         boosted
//           ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white shadow-emerald-200/60"
//           : "border-stone-200 bg-white",
//       ].join(" ")}
//     >
//       <div
//         className={[
//           "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl",
//           accent,
//         ].join(" ")}
//       >
//         <Icon size={20} className="text-white" strokeWidth={2.25} />
//       </div>
//       <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
//         {label}
//       </p>
//       <p
//         className={[
//           "mt-1 text-2xl font-bold tabular-nums transition-colors duration-500",
//           boosted ? "text-emerald-700" : "text-stone-800",
//         ].join(" ")}
//       >
//         {value}{" "}
//         <span className="text-sm font-medium text-stone-400">{unit}</span>
//       </p>
//       {boosted && (
//         <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
//           <ArrowUpRight size={12} /> +30%
//         </span>
//       )}
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  Action plan data                                                    */
// /* ------------------------------------------------------------------ */

// const ACTION_STEPS = [
//   {
//     icon: Fence,
//     title: "ნიადაგის გაუმჯობესება და შემოღობვა",
//     desc: "დაიცავი საძოვარი არასწორი ექსპლუატაციისგან და გაზარდე მისი ხანგრძლივობა მართვადი შემოღობვით.",
//     cta: "შეიძინე ელ. ღობე ფასდაკლებით",
//     ctaIcon: ShoppingCart,
//   },
//   {
//     icon: Stethoscope,
//     title: "ვეტერინარის / აგრონომის კონსულტაცია",
//     desc: "მიიღე პროფესიონალის შეფასება ფარის ჯანმრთელობაზე და საძოვრის ნიადაგის ხარისხზე.",
//     cta: "დაჯავშნე ვიზიტი",
//     ctaIcon: CalendarCheck,
//   },
//   {
//     icon: Truck,
//     title: "ტექნოლოგიური აღჭურვა",
//     desc: "გაზარდე ეფექტურობა შესაბამისი ტექნიკით — სარწყავი სისტემები, საკალათე და სატრანსპორტო აღჭურვილობა.",

//   const [area, setArea] = useState("");
//   const [region, setRegion] = useState("კახეთი");
//   const [condition, setCondition] = useState("საშუალო");
//   const [animal, setAnimal] = useState("მსხვილფეხა რქოსანი/ხბო");

//   const [results, setResults] = useState(null);
//   const [rotational, setRotational] = useState(false);
//   const [showPlan, setShowPlan] = useState(false);

//   const base = useMemo(() => {
//     if (!results) return null;
//     return results;
//   }, [results]);

//   const display = useMemo(() => {
//     if (!base) return null;
//     const factor = rotational ? 1.3 : 1;
//     return {
//       capacity: Math.round(base.capacity * factor),
//       totalYield: Math.round(base.totalYield * factor),
//       revenue: Math.round(base.revenue * factor),
//     };
//   }, [base, rotational]);

//   function handleCalculate() {
//     const r = computeResults({
//       area: area || 10,
//       region,
//       condition,
//       animal,
//     });
//     setResults(r);
//     setRotational(false);
//     setShowPlan(false);
//     setStep("results");
//   }

//   function resetAll() {
//     setStep("onboarding");
//     setPath(null);
//     setResults(null);
//     setShowPlan(false);
//   }

//   return (
//     <div className="min-h-screen w-full bg-[#FAF7F1] font-sans text-stone-800">
//       <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-10 pt-7 sm:max-w-lg">
//         {/* Header */}
//         <header className="mb-6 flex items-center justify-between">
//           <button
//             onClick={resetAll}
//             className="flex items-center gap-2.5"
//             aria-label="დაბრუნება დასაწყისში"
//           >
//             <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 shadow-md shadow-emerald-900/20">
//               <Sprout size={20} className="text-white" strokeWidth={2.5} />
//             </span>
//             <span className="text-xl font-extrabold tracking-tight text-stone-800">
//               Mouravi
//             </span>
//           </button>
//           {step !== "onboarding" && (
//             <button
//               onClick={resetAll}
//               className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 hover:border-stone-300"
//             >
//               <RotateCcw size={13} /> ახლიდან
//             </button>
//           )}
//         </header>

//         {/* ---------------- ONBOARDING ---------------- */}
//         {step === "onboarding" && (
//           <div className="flex flex-1 flex-col">
//             <div className="mb-7">
//               <h1 className="text-[26px] font-extrabold leading-tight text-stone-800">
//                 გამოთვალე შენი მიწის
//                 <br />
//                 <span className="text-emerald-700">სრული პოტენციალი</span>
//               </h1>
//               <p className="mt-2 text-sm leading-relaxed text-stone-500">
//                 შეარჩიე მიმართულება და მიიღე ანალიტიკა შემოსავლის,
//                 გამოსავლიანობისა და საჭირო რესურსების შესახებ — წამებში.
//               </p>
//             </div>

//             <div className="flex flex-1 flex-col gap-4">
//               <button
//                 onClick={() => {
//                   setPath("livestock");
//                   setStep("form");
//                 }}
//                 className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg"
//               >
//                 <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 transition-colors group-hover:bg-emerald-600">
//                   <Tractor
//                     size={26}
//                     className="text-emerald-700 transition-colors group-hover:text-white"
//                     strokeWidth={2}
//                   />
//                 </span>
//                 <div className="flex-1">
//                   <p className="font-bold text-stone-800">
//                     საძოვარი და მეცხოველეობა
//                   </p>
//                   <p className="mt-0.5 text-xs text-stone-500">
//                     ტევადობა, რძე/ხორცის გამოსავლიანობა, შემოსავალი
//                   </p>
//                 </div>
//                 <ChevronRight
//                   size={20}
//                   className="text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600"
//                 />
//               </button>

//               <button
//                 onClick={() => {
//                   setPath("arable");
//                   setStep("form");
//                 }}
//                 className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-lg"
//               >
//                 <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-600">
//                   <Leaf
//                     size={26}
//                     className="text-amber-700 transition-colors group-hover:text-white"
//                     strokeWidth={2}
//                   />
//                 </span>
//                 <div className="flex-1">
//                   <p className="font-bold text-stone-800">
//                     სახნავი და მემცენარეობა
//                   </p>
//                   <p className="mt-0.5 text-xs text-stone-500">
//                     მოსავლიანობა, კულტურის შერჩევა, საბაზრო ღირებულება
//                   </p>
//                 </div>
//                 <ChevronRight
//                   size={20}
//                   className="text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-amber-600"
//                 />
//               </button>
//             </div>

//             <p className="mt-8 text-center text-[11px] text-stone-400">
//               * მონაცემები საილუსტრაციოა — Mouravi-ს ჯერ არ აქვს ცოცხალი
//               ბაზა.
//             </p>
//           </div>
//         )}

//         {/* ---------------- FORM (livestock) ---------------- */}
//         {step === "form" && path === "livestock" && (
//           <div className="flex flex-1 flex-col">
//             <button
//               onClick={() => setStep("onboarding")}
//               className="mb-4 flex w-fit items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-700"
//             >
//               <ChevronLeft size={14} /> უკან
//             </button>

//             <div className="mb-5">
//               <h2 className="text-xl font-bold text-stone-800">
//                 საძოვრის მონაცემები
//               </h2>
//               <p className="mt-1 text-sm text-stone-500">
//                 შეავსე ველები ზუსტი გაანგარიშებისთვის
//               </p>
//             </div>

//             <div className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
//               {/* area */}
//               <div>
//                 <FieldLabel icon={Layers}>ფართობი (ჰექტარი)</FieldLabel>
//                 <input
//                   type="number"
//                   min="0"
//                   value={area}
//                   onChange={(e) => setArea(e.target.value)}
//                   placeholder="10"
//                   className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
//                 />
//               </div>

//               {/* region */}
//               <div>
//                 <FieldLabel icon={MapPin}>რეგიონი</FieldLabel>
//                 <div className="relative">
//                   <select
//                     value={region}
//                     onChange={(e) => setRegion(e.target.value)}
//                     className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-800 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
//                   >
//                     {Object.keys(REGION_FACTOR).map((r) => (
//                       <option key={r} value={r}>
//                         {r}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronRight
//                     size={16}
//                     className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-stone-400"
//                   />
//                 </div>
//               </div>

//               {/* condition */}
//               <div>
//                 <FieldLabel icon={Droplets}>საძოვრის მდგომარეობა</FieldLabel>
//                 <div className="flex flex-wrap gap-2">
//                   <Pill
//                     icon={Sun}
//                     active={condition === "მშრალი"}
//                     onClick={() => setCondition("მშრალი")}
//                   >
//                     მშრალი
//                   </Pill>
//                   <Pill
//                     icon={Layers}
//                     active={condition === "საშუალო"}
//                     onClick={() => setCondition("საშუალო")}
//                   >
//                     საშუალო
//                   </Pill>
//                   <Pill
//                     icon={Waves}
//                     active={condition === "ჭარბტენიანი"}
//                     onClick={() => setCondition("ჭარბტენიანი")}
//                   >
//                     ჭარბტენიანი
//                   </Pill>
//                   <Pill
//                     icon={Droplets}
//                     active={condition === "ირიგირებული"}
//                     onClick={() => setCondition("ირიგირებული")}
//                   >
//                     ირიგირებული
//                   </Pill>
//                 </div>
//               </div>

//               {/* category */}
//               <div>
//                 <FieldLabel icon={Beef}>კატეგორია</FieldLabel>
//                 <div className="grid grid-cols-2 gap-2">
//                   {Object.entries(ANIMAL_PROFILE).map(([name, p]) => {
//                     const Icon = p.icon;
//                     const active = animal === name;
//                     return (
//                       <button
//                         key={name}
//                         type="button"
//                         onClick={() => setAnimal(name)}
//                         className={[
//                           "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center text-xs font-semibold transition-all",
//                           active
//                             ? "border-emerald-700 bg-emerald-700 text-white shadow-md shadow-emerald-900/20"
//                             : "border-stone-200 bg-stone-50 text-stone-600 hover:border-emerald-300",
//                         ].join(" ")}
//                       >
//                         <Icon size={20} strokeWidth={2} />
//                         {name}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={handleCalculate}
//               className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 py-4 text-base font-bold text-white shadow-lg shadow-emerald-900/25 transition-all hover:bg-emerald-800 active:scale-[0.98]"
//             >
//               <Calculator size={19} /> გამოთვლა
//             </button>
//           </div>
//         )}

//         {/* ---------------- FORM (arable placeholder) ---------------- */}
//         {step === "form" && path === "arable" && (
//           <div className="flex flex-1 flex-col items-center justify-center text-center">
//             <button
//               onClick={() => setStep("onboarding")}
//               className="mb-6 flex w-fit items-center gap-1 self-start text-xs font-medium text-stone-500 hover:text-stone-700"
//             >
//               <ChevronLeft size={14} /> უკან
//             </button>
//             <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
//               <Leaf size={30} className="text-amber-700" />
//             </span>
//             <h2 className="text-lg font-bold text-stone-800">
//               მემცენარეობის მოდული მალე
//             </h2>
//             <p className="mt-2 max-w-xs text-sm text-stone-500">
//               ამ ვერსიაში წარმოდგენილია მხოლოდ საძოვარი და მეცხოველეობის
//               კალკულატორი. გადახედე იმ მიმართულებას დემოს სანახავად.
//             </p>
//             <button
//               onClick={() => {
//                 setPath("livestock");
//               }}
//               className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/20 hover:bg-emerald-800"
//             >
//               გადასვლა მეცხოველეობაზე
//             </button>
//           </div>
//         )}

//         {/* ---------------- RESULTS ---------------- */}
//         {step === "results" && display && (
//           <div className="flex flex-1 flex-col">
//             <button
//               onClick={() => setStep("form")}
//               className="mb-4 flex w-fit items-center gap-1 text-xs font-medium text-stone-500 hover:text-stone-700"
//             >
//               <ChevronLeft size={14} /> პარამეტრების შეცვლა
//             </button>

//             <div className="mb-5">
//               <h2 className="text-xl font-bold text-stone-800">
//                 შენი საძოვრის პოტენციალი
//               </h2>
//               <p className="mt-1 text-sm text-stone-500">
//                 {area || 10} ჰა · {region} · {animal}
//               </p>
//             </div>

//             {/* Rotational toggle */}
//             <div className="mb-5 flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
//               <div className="flex items-center gap-3">
//                 <span
//                   className={[
//                     "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
//                     rotational ? "bg-emerald-600" : "bg-stone-100",
//                   ].join(" ")}
//                 >
//                   <RotateCcw
//                     size={18}
//                     className={rotational ? "text-white" : "text-stone-400"}
//                   />
//                 </span>
//                 <div>
//                   <p className="text-sm font-bold text-stone-800">
//                     როტაციული ძოვება
//                   </p>
//                   <p className="text-xs text-stone-500">
//                     ჭკვიანი მართვით — მეტი ტევადობა, ნაკლები ეროზია
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setRotational((v) => !v)}
//                 aria-pressed={rotational}
//                 className={[
//                   "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300",
//                   rotational ? "bg-emerald-600" : "bg-stone-300",
//                 ].join(" ")}
//               >
//                 <span
//                   className={[
//                     "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300",
//                     rotational ? "translate-x-[22px]" : "translate-x-0.5",
//                   ].join(" ")}
//                 />
//               </button>
//             </div>

//             {/* Metric cards */}
//             <div className="grid grid-cols-2 gap-3">
//               <div className="col-span-2">
//                 <MetricCard
//                   icon={Beef}
//                   accent="bg-emerald-600"
//                   label="მაქსიმალური ტევადობა"
//                   value={formatNum(display.capacity)}
//                   unit={base.profile.unit}
//                   boosted={rotational}
//                 />
//               </div>
//               <MetricCard
//                 icon={Milk}
//                 accent="bg-sky-600"
//                 label={base.profile.yieldLabel}
//                 value={formatNum(display.totalYield)}
//                 unit={base.profile.yieldUnit}
//                 boosted={rotational}
//               />
//               <MetricCard
//                 icon={Coins}
//                 accent="bg-amber-600"
//                 label="პოტენციური შემოსავალი"
//                 value={formatNum(display.revenue)}
//                 unit="₾"
//                 boosted={rotational}
//               />
//             </div>

//             {/* Action plan trigger */}
//             {!showPlan && (
//               <button
//                 onClick={() => setShowPlan(true)}
//                 className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-emerald-700 bg-white py-4 text-base font-bold text-emerald-700 shadow-sm transition-all hover:bg-emerald-50 active:scale-[0.98]"
//               >
//                 იხილე სამოქმედო გეგმა <ChevronRight size={18} />
//               </button>
//             )}

//             {/* Action plan */}
//             {showPlan && (
//               <div className="mt-6">
//                 <h3 className="mb-3 text-base font-bold text-stone-800">
//                   სამოქმედო გეგმა
//                 </h3>
//                 <div className="flex flex-col gap-3">
//                   {ACTION_STEPS.map((s, i) => {
//                     const StepIcon = s.icon;
//                     const CtaIcon = s.ctaIcon;
//                     return (
//                       <div
//                         key={s.title}
//                         className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
//                       >
//                         <div className="flex items-start gap-3">
//                           <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs font-bold text-stone-500">
//                             {i + 1}
//                           </span>
//                           <div className="flex-1">
//                             <div className="mb-1 flex items-center gap-1.5">
//                               <StepIcon size={15} className="text-emerald-700" />
//                               <p className="text-sm font-bold text-stone-800">
//                                 {s.title}
//                               </p>
//                             </div>
//                             <p className="text-xs leading-relaxed text-stone-500">
//                               {s.desc}
//                             </p>
//                             <button className="mt-3 flex items-center gap-1.5 rounded-lg bg-stone-800 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700">
//                               <CtaIcon size={14} /> {s.cta}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
//                   <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
//                   გეგმის შესრულებით შესაძლებელია ტევადობის ზრდა საშუალოდ
//                   20–35%-ით.
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

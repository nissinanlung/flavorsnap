import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { analytics } from "@/utils/analytics";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { locale, locales, pathname, asPath, query } = router;

  const getLanguageLabel = (loc: string) => {
    const languageKeys: Record<string, string> = {
      en: "language_en",
      fr: "language_fr",
      ar: "language_ar",
      yo: "language_yo",
    };
    return t(languageKeys[loc] || loc);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    
    // Track language change
    analytics.trackLanguageChange(newLocale);
    
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-switcher" className="text-sm font-medium">
        {t("select_language")}
      </label>
      <select
        id="language-switcher"
        value={locale}
        onChange={handleChange}
        className=" bg-black text-foreground border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
        aria-label={t("select_language")}
      >
        {locales?.map((loc) => (
          <option className="bg-black" key={loc} value={loc}>
            {getLanguageLabel(loc)}
          </option>
        ))}
      </select>
    </div>
  );
}

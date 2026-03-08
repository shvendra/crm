import { useTranslation } from 'react-i18next';

const TermsAndConditions = ({ role }) => {
  const { t } = useTranslation();

  const isAgent = role === 'Agent';
  const isEmployer = role === 'Employer';
  const isSelfWorker = role === 'SelfWorker';

  // Determine which terms to show
  const termsKey = isAgent
    ? 'terms.agentTerms'
    : isEmployer
    ? 'terms.employer'
    : isSelfWorker
    ? 'terms.selfWorkerTerms'
    : 'terms.termsCommon'; // fallback to common terms

  const terms = t(termsKey, { returnObjects: true });

  return (
    <div className="max-h-[400px] overflow-y-auto pr-4 border p-2 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{t('terms.title')}</h2>

      {/* Platform info for non-agent roles */}
      {!isAgent && (
        <p className="mb-2">
          <strong>{t('terms.platform')}</strong>
        </p>
      )}

      <p className="mb-4">
        <strong>{t('terms.effectiveDate')}</strong>
      </p>

      {/* Intro paragraph */}
      {isAgent ? (   
        ""
      ) : (
        <p className="mb-4">{t('terms.termsCommon.intro')}</p>
      )}

      {/* Terms List */}
      <ol className="list-decimal pl-5 space-y-2">
        {Object.entries(terms).map(([key, value], index) => {
          if (key === 'intro') return null; // skip intro
          
          // For termsCommon, limit to 13 items only
          if (!isAgent && !isEmployer && !isSelfWorker && index > 12) return null;

          return (
            <li key={key} className="text-sm">
              {value}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default TermsAndConditions;

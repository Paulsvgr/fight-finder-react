import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CompComponent = ({ Comp, addMessage }) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const isValidComp = Comp && Comp.analyzed

    const handleClick = () => {
        if (isValidComp) {
          navigate(`/${i18n.language}/search_event/${Comp.id}`);
        }
      };
      return (
<div
  key={Comp?.id}
  className={`w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-4 transition-opacity duration-300 ease-in-out ${isValidComp ? 'opacity-100 hover:opacity-90 cursor-pointer' : 'opacity-70'}`}
  onClick={isValidComp ? handleClick : null}
>
  <div className="bg-white p-4 shadow-xl rounded-md">
    <p className="text-lg font-bold mb-2">{Comp.name}</p>
    <p className="text-sm mb-4">{t('Date')}: {Comp.date}</p>
    {!isValidComp && (
      <div className="text-center p-2 rounded-xl border border-gray-300"
        style={{
          backgroundImage: Comp.analyzed ? 'none' : `linear-gradient(to right, #ffffff ${Comp.percentage}%, #a3a3a3 ${Comp.percentage}%)`,
        }}>
        <p className="text-gray-600">{t('Not analyzed yet')}</p>
      </div>
    )}
  </div>
</div>

      );
};

export default CompComponent;

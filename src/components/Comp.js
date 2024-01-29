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
          className={`w-[90vw] md:w-[50vw] lg:w-[33vw] xl:w-[25vw] p-4 transition-opacity duration-300 ease-in-out ${isValidComp ? 'opacity-100 hover:opacity-90 hover:cursor-pointer' : 'opacity-70'}`}
          onClick={isValidComp ? handleClick : null}
        >
          <div className="w-full bg-white p-4 shadow-xl rounded-md">
              <div>
                <p className="text-lg font-bold mb-2">{Comp.name}</p>
                <p className="text-sm">{t('Date')}: {Comp.date}</p>
                {isValidComp || 
                <div className='text-center rounded-xl w-full border-[1px] border-black'
                style={{
                    background: Comp.analyzed ? 'white' : `linear-gradient(90deg, white ${Comp.percentage}%,  #a3a3a3 ${Comp.percentage}%)`,
                }}>
                    <p className="text">{t('Not analyzed yet')}</p>
                </div>
                }
              </div>
          </div>
        </div>
      );
};

export default CompComponent;

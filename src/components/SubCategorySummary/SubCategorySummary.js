import React from 'react';
import PropTypes from 'prop-types';
import IndicatorCard from '../IndicatorCard/IndicatorCard';
import Icon from '../Icon/Icon';
import getMinAndMaxForIndicator from '../../helpers/getMinAndMaxForIndicator';
import getSubCategorySectionId from '../../helpers/getSubCategorySectionId';
import getColorVariant from '../../helpers/getColorVariant';
import {
  INDICATORS,
  CATEGORY_IDS,
} from '../../constants';
import style from './SubCategorySummary.scss';

const SubCategorySummary = (props) => {
  const isContextPage = props.categoryId === CATEGORY_IDS.CONTEXT;
  const backgroundColor = getColorVariant(props.highlightColorLight);
  const cardHighlightColor = getColorVariant(props.highlightColorDark);

  let indicatorIds = props.summaryIndicatorIds;

  // SC-140 for Western Sydney, we can hide some indicator cards
  if (props.city) {
    indicatorIds = indicatorIds.filter((indicatorId) => {
      const hideForThisCity = (
        INDICATORS[indicatorId].hideForCities &&
        INDICATORS[indicatorId].hideForCities.includes(props.city.id)
      );

      return !hideForThisCity;
    });
  }

  const indicatorCardWrappers = indicatorIds.map((indicatorId, i) => {
    const lastOne = i === (indicatorIds.length - 1);
    const indicatorValue = props.city
      ? props.city.indicators[indicatorId]
      : getMinAndMaxForIndicator(
        indicatorId,
        props.cities,
      );

    const linkText = isContextPage
      ? 'View contextual charts'
      : `View all ${props.name} charts`;

    return (
      <div
        key={indicatorId}
        className={style.cardWrapper}
      >
        <IndicatorCard
          className={style.card}
          indicator={indicatorId}
          color={cardHighlightColor}
          colorName={props.categoryColorName}
          value={indicatorValue}
          isContextPage={isContextPage}
        />
        {lastOne && (
          <a
            className={style.linkWrapper}
            href={`#${getSubCategorySectionId(props.name)}`}
          >
            <span className={style.linkText}>{linkText}</span>
          </a>
        )}
      </div>
    );
  });

  return (
    <div style={{ backgroundColor }} className={style.wrapper}>
      <div className={style.container}>
        <div className={style.textWrapper}>
          <Icon
            className={style.iconWrapper}
            icon={props.iconId}
            color={cardHighlightColor}
            size={80}
          />

          <h3 className={style.title}>{props.name}</h3>
        </div>

        <div className={style.cardRow}>
          {indicatorCardWrappers}
        </div>
      </div>
    </div>
  );
};

const cityPropShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  indicators: PropTypes.object.isRequired,
};

SubCategorySummary.propTypes = {
  city: PropTypes.shape(cityPropShape),
  cities: PropTypes.arrayOf(PropTypes.shape(cityPropShape)),
  categoryId: PropTypes.string.isRequired,
  categoryColorName: PropTypes.string.isRequired,
  highlightColorLight: PropTypes.string.isRequired,
  highlightColorDark: PropTypes.string.isRequired,
  iconId: PropTypes.string.isRequired,
  summaryIndicatorIds: PropTypes.arrayOf(
    PropTypes.oneOf(Object.keys(INDICATORS)),
  ).isRequired,
  name: PropTypes.string.isRequired,
};

export default SubCategorySummary;

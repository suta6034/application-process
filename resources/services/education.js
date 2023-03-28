import educationCategories from '../data/education-types.json';

export const EDUCATION_CATEGORY_APPRENTICE = 'Lehre';
export const EDUCATION_TYPE_OTHER = 4077;

export const educationCategoriesGet = () => Promise
    .resolve(Object.keys(educationCategories).map(label => ({
        id: label,
        label,
    })));

export const educationTypesGet = () => Promise
    .resolve(Object.keys(educationCategories).reduce((prev, educationCategory) => {
        const educationTypes = educationCategories[educationCategory];

        return prev.concat(educationTypes.map(schoolType => ({
            ...schoolType,
            parentId: educationCategory,
        })));
    }, []));

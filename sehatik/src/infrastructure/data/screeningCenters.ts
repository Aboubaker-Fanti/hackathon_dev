/**
 * Screening Centers Database - Morocco
 * Static directory of breast cancer screening centers
 * Includes public hospitals, private clinics, NGO centers, and mobile caravans
 */

import { ScreeningCenter } from '../../domain/models/types';

export const SCREENING_CENTERS: ScreeningCenter[] = [
  // CASABLANCA
  {
    id: 'casa_ioc',
    name: 'Institut National d\'Oncologie - Sidi Mohammed Ben Abdellah',
    nameAr: 'المعهد الوطني للأونكولوجيا - سيدي محمد بن عبد الله',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    region: 'Casablanca-Settat',
    address: 'Hay Al Irfane, Sidi Mohamed Ben Abdellah, Casablanca',
    addressAr: 'حي العرفان، سيدي محمد بن عبد الله، الدار البيضاء',
    phone: '+212 522 22 10 10',
    type: 'public',
    services: ['mammography', 'ultrasound', 'biopsy', 'consultation', 'chemotherapy'],
    hasFreeMammography: true,
    latitude: 33.5731,
    longitude: -7.5898,
  },
  {
    id: 'casa_chu',
    name: 'CHU Ibn Rochd - Centre d\'Oncologie',
    nameAr: 'المركز الاستشفائي الجامعي ابن رشد - مركز الأنكولوجيا',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    region: 'Casablanca-Settat',
    address: '1 Rue des Hôpitaux, Casablanca',
    addressAr: 'شارع المستشفيات 1، الدار البيضاء',
    phone: '+212 522 48 20 20',
    type: 'public',
    services: ['mammography', 'ultrasound', 'consultation', 'surgery'],
    hasFreeMammography: true,
    latitude: 33.5830,
    longitude: -7.6167,
  },
  {
    id: 'casa_lalla_salma',
    name: 'Centre de Référence - Fondation Lalla Salma',
    nameAr: 'المركز المرجعي - مؤسسة للا سلمى',
    city: 'Casablanca',
    cityAr: 'الدار البيضاء',
    region: 'Casablanca-Settat',
    address: 'Quartier des Hôpitaux, Casablanca',
    addressAr: 'حي المستشفيات، الدار البيضاء',
    phone: '+212 522 29 84 84',
    type: 'ngo',
    services: ['mammography', 'ultrasound', 'consultation', 'support_groups'],
    hasFreeMammography: true,
    latitude: 33.5750,
    longitude: -7.6050,
  },
  // RABAT
  {
    id: 'rabat_ino',
    name: 'Institut National d\'Oncologie',
    nameAr: 'المعهد الوطني للأنكولوجيا',
    city: 'Rabat',
    cityAr: 'الرباط',
    region: 'Rabat-Salé-Kénitra',
    address: 'Avenue Allal El Fassi, Hay Riad, Rabat',
    addressAr: 'شارع علال الفاسي، حي الرياض، الرباط',
    phone: '+212 537 77 30 30',
    type: 'public',
    services: ['mammography', 'ultrasound', 'biopsy', 'consultation', 'chemotherapy', 'radiotherapy'],
    hasFreeMammography: true,
    latitude: 33.9716,
    longitude: -6.8498,
  },
  {
    id: 'rabat_chu',
    name: 'CHU Ibn Sina - Maternité Souissi',
    nameAr: 'المركز الاستشفائي الجامعي ابن سينا - مستشفى السويسي',
    city: 'Rabat',
    cityAr: 'الرباط',
    region: 'Rabat-Salé-Kénitra',
    address: 'Avenue Mohamed Ben Abdellah, Rabat',
    addressAr: 'شارع محمد بن عبد الله، الرباط',
    phone: '+212 537 67 27 27',
    type: 'public',
    services: ['mammography', 'ultrasound', 'consultation'],
    hasFreeMammography: true,
    latitude: 33.9833,
    longitude: -6.8500,
  },
  // MARRAKECH
  {
    id: 'marrakech_chu',
    name: 'CHU Mohamed VI - Centre d\'Oncologie',
    nameAr: 'المركز الاستشفائي الجامعي محمد السادس - مركز الأنكولوجيا',
    city: 'Marrakech',
    cityAr: 'مراكش',
    region: 'Marrakech-Safi',
    address: 'Avenue Ibn Sina, Marrakech',
    addressAr: 'شارع ابن سينا، مراكش',
    phone: '+212 524 30 08 50',
    type: 'public',
    services: ['mammography', 'ultrasound', 'biopsy', 'consultation', 'chemotherapy', 'surgery'],
    hasFreeMammography: true,
    latitude: 31.6340,
    longitude: -8.0150,
  },
  {
    id: 'marrakech_lalla_salma',
    name: 'Centre de Détection Précoce - Fondation Lalla Salma',
    nameAr: 'مركز الكشف المبكر - مؤسسة للا سلمى',
    city: 'Marrakech',
    cityAr: 'مراكش',
    region: 'Marrakech-Safi',
    address: 'Guéliz, Marrakech',
    addressAr: 'كليز، مراكش',
    phone: '+212 524 43 99 99',
    type: 'ngo',
    services: ['mammography', 'ultrasound', 'consultation', 'awareness'],
    hasFreeMammography: true,
    latitude: 31.6295,
    longitude: -8.0083,
  },
  // FES
  {
    id: 'fes_chu',
    name: 'CHU Hassan II - Centre d\'Oncologie',
    nameAr: 'المركز الاستشفائي الجامعي الحسن الثاني - مركز الأنكولوجيا',
    city: 'Fès',
    cityAr: 'فاس',
    region: 'Fès-Meknès',
    address: 'Route Sidi Hrazem, Fès',
    addressAr: 'طريق سيدي حرازم، فاس',
    phone: '+212 535 61 91 53',
    type: 'public',
    services: ['mammography', 'ultrasound', 'biopsy', 'consultation', 'chemotherapy'],
    hasFreeMammography: true,
    latitude: 34.0181,
    longitude: -5.0078,
  },
  // TANGER
  {
    id: 'tanger_chu',
    name: 'CHU Mohammed VI - Tanger',
    nameAr: 'المركز الاستشفائي الجامعي محمد السادس - طنجة',
    city: 'Tanger',
    cityAr: 'طنجة',
    region: 'Tanger-Tétouan-Al Hoceïma',
    address: 'Route de Rabat, Tanger',
    addressAr: 'طريق الرباط، طنجة',
    phone: '+212 539 33 50 50',
    type: 'public',
    services: ['mammography', 'ultrasound', 'consultation'],
    hasFreeMammography: true,
    latitude: 35.7595,
    longitude: -5.8340,
  },
  // AGADIR
  {
    id: 'agadir_chu',
    name: 'CHU Souss-Massa - Centre d\'Oncologie',
    nameAr: 'المركز الاستشفائي الجامعي سوس ماسة - مركز الأنكولوجيا',
    city: 'Agadir',
    cityAr: 'أكادير',
    region: 'Souss-Massa',
    address: 'Avenue Hassan II, Agadir',
    addressAr: 'شارع الحسن الثاني، أكادير',
    phone: '+212 528 29 86 86',
    type: 'public',
    services: ['mammography', 'ultrasound', 'consultation'],
    hasFreeMammography: true,
    latitude: 30.4278,
    longitude: -9.5981,
  },
  // OUJDA
  {
    id: 'oujda_chu',
    name: 'CHU Mohammed VI - Oujda',
    nameAr: 'المركز الاستشفائي الجامعي محمد السادس - وجدة',
    city: 'Oujda',
    cityAr: 'وجدة',
    region: 'Oriental',
    address: 'Route Al Irfane, Oujda',
    addressAr: 'طريق العرفان، وجدة',
    phone: '+212 536 51 21 21',
    type: 'public',
    services: ['mammography', 'ultrasound', 'biopsy', 'consultation', 'chemotherapy'],
    hasFreeMammography: true,
    latitude: 34.6814,
    longitude: -1.9086,
  },
  // MEKNES
  {
    id: 'meknes_onco',
    name: 'Centre d\'Oncologie - Meknès',
    nameAr: 'مركز الأنكولوجيا - مكناس',
    city: 'Meknès',
    cityAr: 'مكناس',
    region: 'Fès-Meknès',
    address: 'Avenue des FAR, Meknès',
    addressAr: 'شارع القوات المسلحة الملكية، مكناس',
    phone: '+212 535 52 28 28',
    type: 'public',
    services: ['mammography', 'ultrasound', 'consultation'],
    hasFreeMammography: true,
    latitude: 33.8935,
    longitude: -5.5473,
  },

  // ========================================
  // BENGUERIR & RHAMNA REGION (Demo Data)
  // ========================================

  // Hôpital Provincial de Benguerir - public hospital
  {
    id: 'benguerir_hopital',
    name: 'Hôpital Provincial de Benguerir',
    nameAr: 'المستشفى الإقليمي بنجرير',
    city: 'Benguerir',
    cityAr: 'بنجرير',
    region: 'Marrakech-Safi',
    address: 'Avenue Hassan II, Benguerir',
    addressAr: 'شارع الحسن الثاني، بنجرير',
    phone: '+212 524 34 50 50',
    type: 'public',
    services: ['mammography', 'ultrasound', 'consultation', 'clinical_exam'],
    hasFreeMammography: true,
    latitude: 32.1033,
    longitude: -7.9553,
  },
  // Centre de Santé Communal - public health center
  {
    id: 'benguerir_cs',
    name: 'Centre de Santé Communal Benguerir',
    nameAr: 'المركز الصحي الجماعي بنجرير',
    city: 'Benguerir',
    cityAr: 'بنجرير',
    region: 'Marrakech-Safi',
    address: 'Quartier Al Massira, Benguerir',
    addressAr: 'حي المسيرة، بنجرير',
    phone: '+212 524 34 22 10',
    type: 'public',
    services: ['consultation', 'clinical_exam', 'self_exam_training'],
    hasFreeMammography: false,
    latitude: 32.0980,
    longitude: -7.9520,
  },
  // Clinique Privée Al Amal - private clinic
  {
    id: 'benguerir_clinique_amal',
    name: 'Clinique Al Amal - Benguerir',
    nameAr: 'مصحة الأمل - بنجرير',
    city: 'Benguerir',
    cityAr: 'بنجرير',
    region: 'Marrakech-Safi',
    address: 'Rue Mohamed V, Centre-ville, Benguerir',
    addressAr: 'شارع محمد الخامس، وسط المدينة، بنجرير',
    phone: '+212 524 34 88 00',
    type: 'private',
    services: ['mammography', 'ultrasound', 'consultation', 'biopsy'],
    hasFreeMammography: false,
    latitude: 32.1080,
    longitude: -7.9510,
  },
  // Clinique Spécialisée Rhamna - private specialist clinic
  {
    id: 'benguerir_clinique_rhamna',
    name: 'Clinique Spécialisée Rhamna',
    nameAr: 'المصحة المتخصصة الرحامنة',
    city: 'Benguerir',
    cityAr: 'بنجرير',
    region: 'Marrakech-Safi',
    address: 'Boulevard Mohammed VI, Benguerir',
    addressAr: 'شارع محمد السادس، بنجرير',
    phone: '+212 524 34 77 77',
    type: 'private',
    services: ['mammography', 'ultrasound', 'consultation', 'surgery'],
    hasFreeMammography: false,
    latitude: 32.1015,
    longitude: -7.9600,
  },

  // ========================================
  // MOBILE CARAVANS (Demo Data)
  // ========================================

  // Caravane médicale near UM6P - NGO mobile screening
  {
    id: 'caravan_um6p',
    name: 'Caravane Médicale - Fondation Lalla Salma (UM6P)',
    nameAr: 'القافلة الطبية - مؤسسة للا سلمى (جامعة محمد السادس)',
    city: 'Benguerir',
    cityAr: 'بنجرير',
    region: 'Marrakech-Safi',
    address: 'Campus UM6P, Route de Marrakech, Benguerir',
    addressAr: 'حرم جامعة محمد السادس متعددة التخصصات، طريق مراكش، بنجرير',
    phone: '+212 600 00 00 01',
    type: 'caravan',
    services: ['mammography', 'ultrasound', 'consultation', 'clinical_exam', 'self_exam_training', 'awareness'],
    hasFreeMammography: true,
    latitude: 32.2200,
    longitude: -7.9380,
    availableDates: { start: '2026-02-10', end: '2026-02-20' },
    isActive: true,
  },
  // Caravane médicale Sidi Rahal region
  {
    id: 'caravan_sidi_rahal',
    name: 'Caravane de Dépistage - Sidi Rahal',
    nameAr: 'قافلة الكشف المبكر - سيدي رحال',
    city: 'Sidi Rahal',
    cityAr: 'سيدي رحال',
    region: 'Marrakech-Safi',
    address: 'Centre de Santé, Sidi Rahal',
    addressAr: 'المركز الصحي، سيدي رحال',
    phone: '+212 600 00 00 02',
    type: 'caravan',
    services: ['mammography', 'consultation', 'clinical_exam', 'awareness'],
    hasFreeMammography: true,
    latitude: 31.9700,
    longitude: -7.9100,
    availableDates: { start: '2026-02-15', end: '2026-02-25' },
    isActive: true,
  },
];

export const REGIONS = [...new Set(SCREENING_CENTERS.map((c) => c.region))].sort();
export const CITIES = [...new Set(SCREENING_CENTERS.map((c) => c.city))].sort();

export const getCentersByCity = (city: string): ScreeningCenter[] =>
  SCREENING_CENTERS.filter((c) => c.city.toLowerCase() === city.toLowerCase());

export const getCentersByRegion = (region: string): ScreeningCenter[] =>
  SCREENING_CENTERS.filter((c) => c.region === region);

export const getFreeMammographyCenters = (): ScreeningCenter[] =>
  SCREENING_CENTERS.filter((c) => c.hasFreeMammography);

export const getActiveCaravans = (): ScreeningCenter[] =>
  SCREENING_CENTERS.filter((c) => c.type === 'caravan' && c.isActive);

export const getCentersByService = (service: string): ScreeningCenter[] =>
  SCREENING_CENTERS.filter((c) => c.services.includes(service as any));

export const searchCenters = (query: string): ScreeningCenter[] => {
  const q = query.toLowerCase();
  return SCREENING_CENTERS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.nameAr.includes(query) ||
      c.city.toLowerCase().includes(q) ||
      c.cityAr.includes(query),
  );
};

/**
 * Haversine formula: calculate distance between two GPS coordinates
 * @returns distance in kilometers
 */
export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Get centers sorted by distance from a given location
 */
export const getCentersSortedByDistance = (
  userLat: number,
  userLon: number,
  centers: ScreeningCenter[] = SCREENING_CENTERS,
): Array<ScreeningCenter & { distance: number }> => {
  return centers
    .map((center) => ({
      ...center,
      distance: haversineDistance(userLat, userLon, center.latitude, center.longitude),
    }))
    .sort((a, b) => a.distance - b.distance);
};

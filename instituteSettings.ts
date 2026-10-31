/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InstituteSettings } from '../types';
import defaultEmblem from '../assets/images/institute_emblem_1793449692786.jpg';
import defaultSeal from '../assets/images/institute_seal_1793449693065.jpg';

const STORAGE_KEY = 'abdelraouf_institute_settings';

export const DEFAULT_INSTITUTE_SETTINGS: InstituteSettings = {
  instituteName: 'معهد عبد الرؤوف الإعدادي والثانوي الأزهري (بنين)',
  stageDescription: 'المرحلة الإعدادية والثانوية بنين (علمي وأدبي)',
  sectorName: 'الأزهر الشريف · قطاع المعاهد الأزهرية',
  regionName: 'منطقة القاهرة الأزهرية',
  administrationName: 'إدارة وسط القاهرة التعليمية الأزهرية',
  instituteCode: 'AZ-98214',
  establishedYear: '1341 هـ / 1923 م',
  academicYear: '1447 - 1448 هـ / 2025 - 2026 م',
  logoUrl: defaultEmblem,
  sealUrl: defaultSeal,
  headmasterName: 'الشيخ د. عبد الحميد رضوان',
  studentAffairsHead: 'أ. عادل جاد الحق القاضي',
  controlHead: 'الشيخ إبراهيم عبد السلام النجار',
  financialHead: 'أ. فريد شاكر المنياوي',
  address: '15 شارع الأزهر، حي الحسين، القاهرة',
  phone: '0225101234',
};

export function getInstituteSettings(): InstituteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INSTITUTE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_INSTITUTE_SETTINGS,
      ...parsed,
      // fallback to default images if empty
      logoUrl: parsed.logoUrl || defaultEmblem,
      sealUrl: parsed.sealUrl || defaultSeal,
    };
  } catch (err) {
    console.warn('Failed to parse institute settings:', err);
    return DEFAULT_INSTITUTE_SETTINGS;
  }
}

export function saveInstituteSettings(settings: InstituteSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('institute-settings-updated'));
  } catch (err) {
    console.error('Failed to save institute settings:', err);
  }
}

export function resetInstituteSettings(): InstituteSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('institute-settings-updated'));
  } catch (err) {
    console.error('Failed to reset institute settings:', err);
  }
  return DEFAULT_INSTITUTE_SETTINGS;
}

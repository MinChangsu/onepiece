import { atom } from 'recoil';

export const areaCode = atom({
  key: 'areaCode',
  default: '43730', // 시군코드
});

// 점용 키값
export const dataSeq = atom({
  key: 'dataSeq',
  default: 0,
});

export const isNewData = atom({
  key: 'isNewData',
  default: false, // 하천점용 신규 여부
});

// 점용 편집 옵션
export const dataUseEditMode = atom({
  key: 'dataUseEditMode',
  default: '', // DRAW_LINE, DRAW_POLYGON, DRAW_POINT, DRAW_RESET
});

// 지도 편집 옵션
export const mapEditModeType = atom({
  key: 'mapEditModeType',
  default: '', // MAP_ZOOM_IN, MAP_ZOOM_OUT, MAP_DISTANCE, MAP_AREA
});

// 카카오 지도 변경
export const kakaoMapType = atom({
  key: 'kakaoMapType',
  default: new Set(),
});

// 일필지 정보 모달 출력 여부
export const krasModalViewMode = atom({
  key: 'krasModalViewMode',
  default: false,
});

// 하천점용 정보 모달 출력 여부
export const docModalViewMode = atom({
  key: 'docModalViewMode',
  default: false,
});

// 재산정보 모달 출력 여부
export const propertyModalViewMode = atom({
  key: 'propertyModalViewMode',
  default: false,
});

// 캐릭터 모달 출력 여부
export const characterInfoModalViewMode = atom({
  key: 'characterInfoViewMode',
  default: false,
});

// 무단점유 목록 모달 출력 여부
export const illegalListModalViewMode = atom({
  key: 'illegalListModalViewMode',
  default: false,
});

// 지번검색 시 지도 이동을 위한 PNU
export const pnuCode = atom({
  key: 'pnuCode',
  default: '',
});

// kras 일필지 정보용
export const pnuAddress = atom({
  key: 'pnuAddress',
  default: '',
});

// 지도상에서 보여지는 현재 주소정보
export const mapAddress = atom({
  key: 'mapAddress',
  default: '',
});
// 지도상에서 보여지는 현재 주소정보2
export const umdRiCd = atom({
  key: 'umdRiCd',
  default: { emdCd: '43730250', riCd: '4373025021' },
});

// 하천점용 위치이동을 위한 키값
export const dataSeqToMove = atom({
  key: 'dataSeqToMove',
  default: 0,
});

// 음면동 목록
export const umdList = atom({
  key: 'umdList',
  default: [],
});

// 도로법 레이어 구분
/*
지적도                = cbndUse
행정동                = hjdUse
영구점용허가          = evrlUse
일시점용허가          = tmprUse
도로법                = ui101
  도로구역            = uia100
  접도구역            = uia200
  입체적도로구역      = uia300
  도로보전입체구역    = uia400
  자동차전용도로구역  = uia500
국토계획/교통시설     = uq161
 */

export const colorChangeLayerView = atom({
  key: 'colorChangeLayerView',
  default: false,
});

export const lineColorChangeLayerView = atom({
  key: 'lineColorChangeLayerView',
  default: false,
});

export const isChangeLayerColor = atom({
  key: 'isChangeLayerColor',
  default: false,
});
export const changeLayerColor = atom({
  key: 'changeLayerColor',
  default: '',
});

export const dataLawLayerType = atom({
  key: 'dataLawLayerType',
  default: [],
});

// 주제됴 레이어 목록
export const dataLayerList = atom({
  key: 'dataLayerList',
  default: [],
});

// 주제됴 새로고침해야할 레이어 목록
export const refreshLayerList = atom({
  key: 'refreshLayerList',
  default: [],
});

// 연계정보를 통해 가져온 XML 데이터를 MAP 형태로 저장
// {'KRAS000002': '...', 'KRAS000006': '...'}
export const krasData = atom({
  key: 'krasData',
  default: {},
});

// SHP 수정 모드 // UPD, ADD, DEL
export const featureMode = atom({
  key: 'featureMode',
  default: '',
});

export const layerPosition = atom({
  key: 'layerPosition',
  default: { x: 0, y: 0 },
});

export const layerPositionAction = atom({
  key: 'layerPositionAction',
  default: false,
});
//레이어 줌레벨 정보
export const layerZoomState = atom({
  key: 'layerZoomState',
  default: '150000',
});
// 커서 위치 정보
export const layerPositionCoord = atom({
  key: 'layerPositionCoord',
  default: [0, 0],
});
// 커서 위치 정보(읍면동리 출력용 5181좌표계)
export const layerPositionCoord_5181 = atom({
  key: 'layerPositionCoord_5181',
  default: [0, 0],
});
export const isViewPlaneOption = atom({
  key: 'isViewPlaneOption',
  default: 'false',
});

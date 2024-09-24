import XMLParser from 'react-xml-parser/xmlParser';

export const parseKrasXmlToMap = (key, val) => {
  let xml = new XMLParser().parseFromString(val);
  let data = {};
  if (key === 'KRAS000002') {
    try {
      let landInfo = xml.getElementsByTagName('LAND_INFO')[0];
      if (landInfo) {
        data['ADM_SECT_CD'] = landInfo.getElementsByTagName('ADM_SECT_CD')[0].value;
        data['LAND_LOC_CD'] = landInfo.getElementsByTagName('LAND_LOC_CD')[0].value;
        data['LEDG_GBN'] = landInfo.getElementsByTagName('LEDG_GBN')[0].value;
        data['BOBN'] = landInfo.getElementsByTagName('BOBN')[0].value;
        data['BUBN'] = landInfo.getElementsByTagName('BUBN')[0].value;
        data['JIMOK'] = landInfo.getElementsByTagName('JIMOK')[0].value;
        data['JIMOK_NM'] = landInfo.getElementsByTagName('JIMOK_NM')[0].value;
        data['PAREA'] = landInfo.getElementsByTagName('PAREA')[0].value;
        data['GRD'] = landInfo.getElementsByTagName('GRD')[0].value;
        data['GRD_YMD'] = landInfo.getElementsByTagName('GRD_YMD')[0].value;
        data['LAND_MOV_RSN_CD'] = landInfo.getElementsByTagName('LAND_MOV_RSN_CD')[0].value;
        data['LAND_MOV_RSN_CD_NM'] = landInfo.getElementsByTagName('LAND_MOV_RSN_CD_NM')[0].value;
        data['LAND_MOV_YMD'] = landInfo.getElementsByTagName('LAND_MOV_YMD')[0].value;
        data['LEDG_CNTRST_CNF_GBN'] = landInfo.getElementsByTagName('LEDG_CNTRST_CNF_GBN')[0].value;
        data['BIZ_ACT_NTC_GBN'] = landInfo.getElementsByTagName('BIZ_ACT_NTC_GBN')[0].value;
        data['MAP_GBN'] = landInfo.getElementsByTagName('MAP_GBN')[0].value;
        data['LAND_LAST_HIST_ODRNO'] = landInfo.getElementsByTagName('LAND_LAST_HIST_ODRNO')[0].value;
        data['OWN_RGT_LAST_HIST_ODRNO'] = landInfo.getElementsByTagName('OWN_RGT_LAST_HIST_ODRNO')[0].value;
        data['OWNER_NM'] = landInfo.getElementsByTagName('OWNER_NM')[0].value;
        data['DREGNO'] = landInfo.getElementsByTagName('DREGNO')[0].value;
        data['OWN_GBN'] = landInfo.getElementsByTagName('OWN_GBN')[0].value;
        data['OWN_GBN_NM'] = landInfo.getElementsByTagName('OWN_GBN_NM')[0].value;
        data['SHR_CNT'] = landInfo.getElementsByTagName('SHR_CNT')[0].value;
        data['OWNER_ADDR'] = landInfo.getElementsByTagName('OWNER_ADDR')[0].value;
        data['OWN_RGT_CHG_RSN_CD'] = landInfo.getElementsByTagName('OWN_RGT_CHG_RSN_CD')[0].value;
        data['OWN_RGT_CHG_RSN_CD_NM'] = landInfo.getElementsByTagName('OWN_RGT_CHG_RSN_CD_NM')[0].value;
        data['OWNDYMD'] = landInfo.getElementsByTagName('OWNDYMD')[0].value;
        data['SCALE'] = landInfo.getElementsByTagName('SCALE')[0].value;
        data['SCALE_NM'] = landInfo.getElementsByTagName('SCALE_NM')[0].value;
        data['DOHO'] = landInfo.getElementsByTagName('DOHO')[0].value;
        data['JIGA_BASE_MON'] = landInfo.getElementsByTagName('JIGA_BASE_MON')[0].value;
        data['PANN_JIGA'] = landInfo.getElementsByTagName('PANN_JIGA')[0].value;
        data['LAST_JIBN'] = landInfo.getElementsByTagName('LAST_JIBN')[0].value;
        data['LAST_BU'] = landInfo.getElementsByTagName('LAST_BU')[0].value;
        data['LASTBOBN'] = landInfo.getElementsByTagName('LASTBOBN')[0].value;
        data['LASTBUBN'] = landInfo.getElementsByTagName('LASTBUBN')[0].value;
        data['LAND_MOV_CHRG_MAN_ID'] = landInfo.getElementsByTagName('LAND_MOV_CHRG_MAN_ID')[0].value;
        data['OWN_RGT_CHG_CHRG_MAN_ID'] = landInfo.getElementsByTagName('OWN_RGT_CHG_CHRG_MAN_ID')[0].value;
      }
    } catch (e) {
      //console.log(e);
    }
  } else if (key === 'KRAS000006') {
    let landMoveHist = xml.getElementsByTagName('LAND_MOV_HIST');
    if (landMoveHist && landMoveHist.length > 0) {
      data = [];
      try {
        landMoveHist.forEach((item) => {
          let row = {};
          row['JIMOK'] = item.getElementsByTagName('JIMOK')[0].value;
          row['LAND_MOV_RSN_CD'] = item.getElementsByTagName('LAND_MOV_RSN_CD')[0].value;
          row['SCALE'] = item.getElementsByTagName('SCALE')[0].value;
          row['OWN_GBN'] = item.getElementsByTagName('OWN_GBN')[0].value;
          row['SHR_CNT'] = item.getElementsByTagName('SHR_CNT')[0].value;
          row['OWNER_ADDR'] = item.getElementsByTagName('OWNER_ADDR')[0].value;
          row['OWNER_NM'] = item.getElementsByTagName('OWNER_NM')[0].value;
          row['SCALE_NM'] = item.getElementsByTagName('SCALE_NM')[0].value;
          row['DOHO'] = item.getElementsByTagName('DOHO')[0].value;
          row['DEL_YMD'] = item.getElementsByTagName('DEL_YMD')[0].value;
          row['LAND_MOV_DEL_YMD'] = item.getElementsByTagName('LAND_MOV_DEL_YMD')[0].value;
          row['LAND_MOV_HIST_ODRNO'] = item.getElementsByTagName('LAND_MOV_HIST_ODRNO')[0].value;
          row['LAND_HIST_ODRNO'] = item.getElementsByTagName('LAND_HIST_ODRNO')[0].value;
          row['JIMOK_NM'] = item.getElementsByTagName('JIMOK_NM')[0].value;
          row['PAREA'] = item.getElementsByTagName('PAREA')[0].value;
          row['DYMD'] = item.getElementsByTagName('DYMD')[0].value;
          row['LAND_MOV_RSN_CD_NM'] = item.getElementsByTagName('LAND_MOV_RSN_CD_NM')[0].value;
          row['LAND_MOV_CHRG_MAN_ID'] = item.getElementsByTagName('LAND_MOV_CHRG_MAN_ID')[0].value;
          row['JIBUN'] = item.getElementsByTagName('JIBUN')[0].value;
          data.push(row);
        });
      } catch (e) {
        //console.log(e);
      }
    }
  } else if (key === 'KRAS000021') {
    let gisBldgIntergInfo = xml.getElementsByTagName('GIS_BLDG_INTERG_INFO');
    try {
      if (gisBldgIntergInfo && gisBldgIntergInfo.length > 0) {
        data = [];
        gisBldgIntergInfo.forEach((item) => {
          let row = {};
          row['LAND_LOC_NM'] = item.getElementsByTagName('LAND_LOC_NM')[0].value;
          row['JIBN'] = item.getElementsByTagName('JIBN')[0].value;
          row['PNU'] = item.getElementsByTagName('PNU')[0].value;
          row['UFID'] = item.getElementsByTagName('UFID')[0].value;
          row['BLDG_NM'] = item.getElementsByTagName('BLDG_NM')[0].value;
          row['DONG'] = item.getElementsByTagName('DONG')[0].value;
          row['LAREA'] = item.getElementsByTagName('LAREA')[0].value;
          row['BAREA'] = item.getElementsByTagName('BAREA')[0].value;
          row['GAREA'] = item.getElementsByTagName('GAREA')[0].value;
          row['BLR'] = item.getElementsByTagName('BLR')[0].value;
          row['FSI'] = item.getElementsByTagName('FSI')[0].value;
          row['VIO_BLDG_YN'] = item.getElementsByTagName('VIO_BLDG_YN')[0].value;
          row['UFLR'] = item.getElementsByTagName('UFLR')[0].value;
          row['BFLR'] = item.getElementsByTagName('BFLR')[0].value;
          row['HGT'] = item.getElementsByTagName('HGT')[0].value;
          row['STRU_CD'] = item.getElementsByTagName('STRU_CD')[0].value;
          row['STRU_NM'] = item.getElementsByTagName('STRU_NM')[0].value;
          row['MAIN_USE_CD'] = item.getElementsByTagName('MAIN_USE_CD')[0].value;
          row['MAIN_USE_NM'] = item.getElementsByTagName('MAIN_USE_NM')[0].value;
          row['USE_APRV_YMD'] = item.getElementsByTagName('USE_APRV_YMD')[0].value;
          row['BLDG_GBN_NO'] = item.getElementsByTagName('BLDG_GBN_NO')[0].value;
          row['MAIN_SUB_GBN'] = item.getElementsByTagName('MAIN_SUB_GBN')[0].value;
          row['MAIN_SUB_GBN_NM'] = item.getElementsByTagName('MAIN_SUB_GBN_NM')[0].value;
          row['REGIST_DAY'] = item.getElementsByTagName('REGIST_DAY')[0].value;
          row['BNDR_INFO_SRC_CD'] = item.getElementsByTagName('BNDR_INFO_SRC_CD')[0].value;
          row['BNDR_INFO_SRC_NM'] = item.getElementsByTagName('BNDR_INFO_SRC_NM')[0].value;
          row['ATTR_INFO_SRC_CD'] = item.getElementsByTagName('ATTR_INFO_SRC_CD')[0].value;
          row['ATTR_INFO_SRC_NM'] = item.getElementsByTagName('ATTR_INFO_SRC_NM')[0].value;
          row['KM_NAME'] = item.getElementsByTagName('KM_NAME')[0].value;
          row['KM_NAME_SRC'] = item.getElementsByTagName('KM_NAME_SRC')[0].value;
          row['KM_NAME_SRC_NM'] = item.getElementsByTagName('KM_NAME_SRC_NM')[0].value;
          row['PERMI_NUM'] = item.getElementsByTagName('PERMI_NUM')[0].value;
          row['USE_APR_NUM'] = item.getElementsByTagName('USE_APR_NUM')[0].value;
          row['ETC_CD'] = item.getElementsByTagName('ETC_CD')[0].value;
          row['ETC_CD_NM'] = item.getElementsByTagName('ETC_CD_NM')[0].value;
          row['CH_JIBUN'] = item.getElementsByTagName('CH_JIBUN')[0].value;
          row['CH_JIBUN_NM'] = item.getElementsByTagName('CH_JIBUN_NM')[0].value;
          row['MAT_CD'] = item.getElementsByTagName('MAT_CD')[0].value;
          row['S_MAT'] = item.getElementsByTagName('S_MAT')[0].value;
          row['S_MAT_NM'] = item.getElementsByTagName('S_MAT_NM')[0].value;
          row['BLD_CNT'] = item.getElementsByTagName('BLD_CNT')[0].value;
          row['AIS_CNT'] = item.getElementsByTagName('AIS_CNT')[0].value;
          row['NEM_DATE'] = item.getElementsByTagName('NEM_DATE')[0].value;
          row['PNU_ORG'] = item.getElementsByTagName('PNU_ORG')[0].value;
          row['BU_MAT_GB_CD'] = item.getElementsByTagName('BU_MAT_GB_CD')[0].value;
          row['BU_MAT_GB_NM'] = item.getElementsByTagName('BU_MAT_GB_NM')[0].value;
          row['SUB_INFO_CNT'] = item.getElementsByTagName('SUB_INFO_CNT')[0].value;
          data.push(row);
        });
      }
    } catch (e) {
      //console.log(e);
    }
  } else if (key === 'KRAS000026') {
    let base = xml.getElementsByTagName('LAND_USE_PLAN_CNF_INFO_BASE')[0];
    try {
      if (base) {
        let x = {};
        x['ISS_SCALE'] = base.getElementsByTagName('ISS_SCALE')[0].value;
        x['ISS_NO'] = base.getElementsByTagName('ISS_NO')[0].value;
        x['SEQNO'] = base.getElementsByTagName('SEQNO')[0].value;
        x['ADM_SECT_HEAD'] = base.getElementsByTagName('ADM_SECT_HEAD')[0].value;
        x['BCHK'] = base.getElementsByTagName('BCHK')[0].value;
        x['LAND_LOC_NM'] = base.getElementsByTagName('LAND_LOC_NM')[0].value;
        x['JIBN'] = base.getElementsByTagName('JIBN')[0].value;
        x['JIMOK'] = base.getElementsByTagName('JIMOK')[0].value;
        x['JIMOK_NM'] = base.getElementsByTagName('JIMOK_NM')[0].value;
        x['PAREA'] = base.getElementsByTagName('PAREA')[0].value;
        x['USELAW_A'] = base.getElementsByTagName('USELAW_A')[0].value;
        x['USELAW_B'] = base.getElementsByTagName('USELAW_B')[0].value;
        x['USELAW_C'] = base.getElementsByTagName('USELAW_C')[0].value;
        x['USELAW_D'] = base.getElementsByTagName('USELAW_D')[0].value;
        x['IMG'] = base.getElementsByTagName('IMG')[0].value;
        x['SEAL_IMG'] = base.getElementsByTagName('SEAL_IMG')[0].value;
        x['STAMP_IMG'] = base.getElementsByTagName('STAMP_IMG')[0].value;
        data['LAND_USE_PLAN_CNF_INFO_BASE'] = x;
      }
      let legend = xml.getElementsByTagName('LEGEND');
      if (legend && legend.length > 0) {
        data['LEGEND'] = [];
        legend.forEach((item) => {
          let row = {};
          row['IMG'] = item.getElementsByTagName('IMG')[0].value;
          row['TEXT'] = item.getElementsByTagName('TEXT')[0].value;
          data['LEGEND'].push(row);
        });
      }
    } catch (e) {
      console.log(e);
    }
  } else if (key === 'KRAS000033') {
    let houseInfoList = xml.getElementsByTagName('HOUSE_INFO_LIST');
    try {
      if (houseInfoList && houseInfoList.length > 0) {
        data['HOUSE_INFO_LIST'] = [];
        houseInfoList.forEach((item) => {
          let row = {};
          row['BASE_YEAR'] = item.getElementsByTagName('BASE_YEAR')[0].value;
          row['INDI_HOUSE_PRC'] = item.getElementsByTagName('INDI_HOUSE_PRC')[0].value;
          row['LAND_AREA'] = item.getElementsByTagName('LAND_AREA')[0].value;
          row['LAND_CALC_AREA'] = item.getElementsByTagName('LAND_CALC_AREA')[0].value;
          row['BLDG_AREA'] = item.getElementsByTagName('BLDG_AREA')[0].value;
          row['BLDG_CALC_AREA'] = item.getElementsByTagName('BLDG_CALC_AREA')[0].value;
          row['DONG_NO'] = item.getElementsByTagName('DONG_NO')[0].value;
          row['STDMT'] = item.getElementsByTagName('STDMT')[0].value;

          data['HOUSE_INFO_LIST'].push(row);
        });
      }
    } catch (e) {
      console.log(e);
    }
  } else if (key === 'KRAS000011') {
    let jiga = xml.getElementsByTagName('JIGA');
    try {
      if (jiga && jiga.length > 0) {
        data = [];
        jiga.forEach((item) => {
          let row = {};
          row['BASE_YEAR'] = item.getElementsByTagName('BASE_YEAR')[0].value;
          row['BASE_MON'] = item.getElementsByTagName('BASE_MON')[0].value;
          row['PANN_JIGA'] = item.getElementsByTagName('PANN_JIGA')[0].value;
          row['PANN_YMD'] = item.getElementsByTagName('PANN_YMD')[0].value;
          row['REMARK'] = item.getElementsByTagName('REMARK')[0].value;
          row['JIGA_JIBN'] = item.getElementsByTagName('JIGA_JIBN')[0].value;

          data.push(row);
        });
      }
    } catch (e) {
      console.log(e);
    }
  } else if (key === 'KRAS000035') {
    let decsnJiga = xml.getElementsByTagName('READ_DECSN_JIGA')[0];
    try {
      if (decsnJiga) {
        data['SEQNO'] = decsnJiga.getElementsByTagName('SEQNO')[0].value;
        data['JIMOK'] = decsnJiga.getElementsByTagName('JIMOK')[0].value;
        data['PAREA'] = decsnJiga.getElementsByTagName('PAREA')[0].value;
        data['PY_JIGA'] = decsnJiga.getElementsByTagName('PY_JIGA')[0].value;
        data['READ_JIGA'] = decsnJiga.getElementsByTagName('READ_JIGA')[0].value;
        data['DECN_JIGA'] = decsnJiga.getElementsByTagName('DECN_JIGA')[0].value;
        data['CALD_STDMT'] = decsnJiga.getElementsByTagName('CALD_STDMT')[0].value;
      }
    } catch (e) {
      console.log(e);
    }
  }
  // console.log(data);
  return data;
};

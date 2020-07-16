//====================
//  Utility Functions

const makeObjUrl = (objStr, buckName, buckRegion = false) => {
  if (buckRegion) {
    // contains region
    return `https://${buckName}.s3-${buckRegion}.amazonaws.com/${objStr}`;
  } else {
    // void of region
    return `https://${buckName}.s3.amazonaws.com/${objStr}`;
  }
};

const makeTrkStr = (trk, artist, trkPre = 320) => {
  const trkStr = trk.split(' ').join('_');
  const artStr = artist.split(' ').join('_');
  //  High 320
  if (trkPre === 320) {
    const objStr = `320/${artStr}/${trkStr}.mp3`;
    console.log('makeTrkStr() > 320/objStr: ', objStr);
    return objStr;
  } else {
    const objStr = `160/${artStr}/${trkStr}.mp3`;
    console.log('makeTrkStr() > 160/objStr: ', objStr);
    return objStr;
  }
};

const makeImgStr = (imageUrl, imgFamily, imgGenus = false) => {
  const famStr = imgFamily.split(' ').join('_');
  const genStr = imgGenus.split(' ').join('_');
  const imgStr = imageUrl.split(' ').join('_');
  // ##_WARN_##
  //  dynamic Extensions
  const imgExt = 'jpg';
  //  High 320
  if (!genStr) {
    const objStr = `${famStr}/${imgStr}`;
    console.log('makeImgStr() > objStr: ', objStr);
    return objStr;
  } else {
    const objStr = `${famStr}/${genStr}/${imgStr}`;
    console.log('makeImgStr() > objStr: ', objStr);
    return objStr;
  }
};

const makeFullUrl = (buckName, buckRegion, trkName, artName) => {
  const trkStr = trkName.split(' ').join('_');
  const artStr = artName.split(' ').join('_');
  //  High 320
  const objStr = `320/${artStr}/${trkStr}.mp3`;
  return `https://${buckName}.s3-${buckRegion}.amazonaws.com/${objStr}`;
};

module.exports = {
  makeObjUrl,
  makeTrkStr,
  makeImgStr,
  makeFullUrl,
};

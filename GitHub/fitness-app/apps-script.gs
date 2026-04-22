// ============================================================
// WEMYSSWORKOUTS — Google Apps Script Backend
// Paste this entire file into your Google Apps Script editor
// See SETUP.md for step-by-step instructions
// ============================================================

var API_KEY = 'CHANGE_THIS_TO_YOUR_SECRET_KEY';  // ← Change this before deploying

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Empty payload' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    var body = JSON.parse(e.postData.contents);
    if (body.apiKey !== API_KEY) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result;
    switch (body.action) {
      case 'logStrength':    result = logStrength(ss, body.data);    break;
      case 'logCardio':      result = logCardio(ss, body.data);      break;
      case 'logBodyComp':    result = logBodyComp(ss, body.data);    break;
      case 'logBiofeedback': result = logBiofeedback(ss, body.data); break;
      case 'deleteSession':  result = deleteSessionData(ss, body.data);  break;
      default: result = { error: 'Unknown action: ' + body.action };
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', result: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    if (e.parameter.apiKey !== API_KEY) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var result = getAllData(ss);
    return ContentService.createTextOutput(JSON.stringify({ status: 'ok', result: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1a1d27').setFontColor('#e8ff4a');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function removeExistingRows(sheet, value, columnNumber) {
  if (!value || sheet.getLastRow() < 2) return;
  var data = sheet.getRange(2, columnNumber, sheet.getLastRow() - 1, 1).getValues();
  var tz = sheet.getParent().getSpreadsheetTimeZone();
  for (var i = data.length - 1; i >= 0; i--) {
    var cellVal = data[i][0];
    var match = false;
    if (cellVal == value) {
      match = true;
    } else if (cellVal instanceof Date && typeof value === 'string' && value.indexOf('-') === 4) {
      if (Utilities.formatDate(cellVal, tz, 'yyyy-MM-dd') === value) match = true;
    }
    if (match) {
      sheet.deleteRow(i + 2);
    }
  }
}

function logStrength(ss, data) {
  var sheet = getOrCreateSheet(ss, 'Strength', [
    'Session ID', 'Date', 'Label', 'Warmup', 'Exercise', 'Set #', 'Weight (kg)', 'Reps', 'Volume (kg)', 'Logged At'
  ]);
  removeExistingRows(sheet, data.id, 1);
  var rows = 0;
  data.blocks.forEach(function(block) {
    block.sets.forEach(function(set, i) {
      var vol = (set.weight && typeof set.reps === 'number') ? set.weight * set.reps : '';
      sheet.appendRow([data.id, data.date, data.label, data.warmup || '', block.name, i + 1, set.weight || '', set.reps, vol, new Date().toISOString()]);
      rows++;
    });
  });
  return { rows: rows };
}

function logCardio(ss, data) {
  var sheet = getOrCreateSheet(ss, 'Cardio', [
    'Session ID', 'Date', 'Label', 'Type', 'Duration', 'Distance (km)', 'Avg HR (bpm)', 'HR Zone', 'Zone Name',
    'Elevation (m)', 'Total kcal', 'Effort (1-10)', 'Effort Label', 'Avg Pace', 'Logged At'
  ]);
  removeExistingRows(sheet, data.id, 1);
  var zoneNames = ['', 'Recovery', 'Base Aerobic', 'Aerobic', 'Threshold', 'Max'];
  sheet.appendRow([
    data.id, data.date, data.label, data.type, data.duration,
    data.distanceKm, data.avgHR, data.hrZone, zoneNames[data.hrZone] || '',
    data.elevationM, data.totalKcal, data.effortScore, data.effortLabel,
    data.avgPace || '', new Date().toISOString()
  ]);
  
  var splitSheet = getOrCreateSheet(ss, 'Cardio Splits', ['Session ID', 'Date', 'km', 'Time', 'Pace', 'HR (bpm)']);
  removeExistingRows(splitSheet, data.id, 1);
  if (data.splits && data.splits.length > 0) {
    data.splits.forEach(function(sp) {
      splitSheet.appendRow([data.id, data.date, sp.km, sp.time, sp.pace, sp.hr]);
    });
  }
  return { ok: true };
}

function logBiofeedback(ss, data) {
  var sheet = getOrCreateSheet(ss, 'Biofeedback', [
    'Date', 'Week', 'Energy (1-5)', 'Sleep (1-5)', 'Motivation (1-5)',
    'Soreness (1-5)', 'Mood (1-5)', 'Avg Score', 'Notes', 'Logged At'
  ]);
  removeExistingRows(sheet, data.date, 1);
  var avg = ((data.energy || 0) + (data.sleep || 0) + (data.motivation || 0) + (data.soreness || 0) + (data.mood || 0)) / 5;
  sheet.appendRow([
    data.date, data.week || '', data.energy, data.sleep, data.motivation,
    data.soreness, data.mood, avg.toFixed(1), data.notes || '', new Date().toISOString()
  ]);
  return { ok: true };
}

function logBodyComp(ss, data) {
  var sheet = getOrCreateSheet(ss, 'BodyComp', [
    'Date', 'Label', 'Weight (kg)', 'Waist (cm)', 'Body Fat %', 'LBM (kg)', 'Fat Mass (kg)', 'Note', 'Logged At'
  ]);
  removeExistingRows(sheet, data.date, 1);
  
  sheet.appendRow([
    data.date, data.label, data.weight, data.waist || '', data.bf || '',
    data.lbm || '', data.fatMass || '', data.note || '', new Date().toISOString()
  ]);
  return { ok: true };
}

function deleteSessionData(ss, data) {
  var sheets = ['Strength', 'Cardio', 'Cardio Splits'];
  sheets.forEach(function(name) {
    var sheet = ss.getSheetByName(name);
    if (sheet) removeExistingRows(sheet, data.id, 1);
  });
  var bcSheet = ss.getSheetByName('BodyComp');
  if (bcSheet && data.date) removeExistingRows(bcSheet, data.date, 1);
  return { ok: true };
}

function getAllData(ss) {
  var result = {};
  var sheets = ['Strength', 'Cardio', 'BodyComp', 'Biofeedback'];
  sheets.forEach(function(name) {
    var sheet = ss.getSheetByName(name);
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      result[name.toLowerCase()] = data;
    }
  });
  return result;
}

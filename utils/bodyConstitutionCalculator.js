const calculateScores = (responses) => {
    const reverseItems = [2, 7, 8, 9, 22, 54];
    const reversed_scores = reverseItems.reduce((acc, item) => {
      acc[item] = 6 - responses[item];
      return acc;
    }, {});
  
    const calculateConvertedScore = (originalScore, itemCount) => {
      return ((originalScore - itemCount) / (itemCount * 4)) * 100;
    }
  
    const balancedScores = [responses[1], reversed_scores[2], reversed_scores[7], reversed_scores[8], reversed_scores[9], reversed_scores[22], responses[53], reversed_scores[54]];
    const balancedOriginal = balancedScores.reduce((acc, score) => acc + score, 0);
    const balancedConverted = calculateConvertedScore(balancedOriginal, 8);
  
    const yangDeficientScores = [responses[18], responses[19], responses[20], responses[22], responses[23], responses[52], responses[55]];
    const yangDeficientOriginal = yangDeficientScores.reduce((acc, score) => acc + score, 0);
    const yangDeficientConverted = calculateConvertedScore(yangDeficientOriginal, 7);
  
    const yinDeficientScores = [responses[17], responses[21], responses[29], responses[35], responses[38], responses[44], responses[46], responses[57]];
    const yinDeficientOriginal = yinDeficientScores.reduce((acc, score) => acc + score, 0);
    const yinDeficientConverted = calculateConvertedScore(yinDeficientOriginal, 8);
  
    const qiDeficientScores = [responses[2], responses[3], responses[4], responses[5], responses[6], responses[7], responses[23], responses[27]];
    const qiDeficientOriginal = qiDeficientScores.reduce((acc, score) => acc + score, 0);
    const qiDeficientConverted = calculateConvertedScore(qiDeficientOriginal, 8);
  
    const phlegmDampScores = [responses[14], responses[16], responses[28], responses[42], responses[49], responses[50], responses[51], responses[58]];
    const phlegmDampOriginal = phlegmDampScores.reduce((acc, score) => acc + score, 0);
    const phlegmDampConverted = calculateConvertedScore(phlegmDampOriginal, 8);
  
    const dampHeatScores = [responses[39], responses[41], responses[48], responses[56], responses[59], responses[60]];
    const dampHeatOriginal = dampHeatScores.reduce((acc, score) => acc + score, 0);
    const dampHeatConverted = calculateConvertedScore(dampHeatOriginal, 6);
  
    const stagnantBloodScores = [responses[8], responses[33], responses[36], responses[37], responses[40], responses[43], responses[45]];
    const stagnantBloodOriginal = stagnantBloodScores.reduce((acc, score) => acc + score, 0);
    const stagnantBloodConverted = calculateConvertedScore(stagnantBloodOriginal, 7);
  
    const stagnantQiScores = [responses[9], responses[10], responses[11], responses[12], responses[13], responses[15], responses[47]];
    const stagnantQiOriginal = stagnantQiScores.reduce((acc, score) => acc + score, 0);
    const stagnantQiConverted = calculateConvertedScore(stagnantQiOriginal, 7);
  
    const inheritedSpecialScores = [responses[24], responses[25], responses[26], responses[30], responses[31], responses[32], responses[34]];
    const inheritedSpecialOriginal = inheritedSpecialScores.reduce((acc, score) => acc + score, 0);
    const inheritedSpecialConverted = calculateConvertedScore(inheritedSpecialOriginal, 8);
  
    return {
      balanced: balancedConverted,
      yangDeficient: yangDeficientConverted,
      yinDeficient: yinDeficientConverted,
      qiDeficient: qiDeficientConverted,
      phlegmDamp: phlegmDampConverted,
      dampHeat: dampHeatConverted,
      stagnantBlood: stagnantBloodConverted,
      stagnantQi: stagnantQiConverted,
      inheritedSpecial: inheritedSpecialConverted
    };
  }
  
  const determineConstitution = (scores) => {
    if (scores['balanced'] >= 60 && Object.values(scores).every(score => score < 30)) {
      return 'Balanced Constitution';
    } else if (scores['balanced'] >= 60 && Object.values(scores).every(score => score < 40)) {
      return 'Basically Balanced Constitution';
    } else {
      const unbalancedConstitutions = [];
      for (const [key, score] of Object.entries(scores)) {
        if (key !== 'balanced') {
          if (score >= 40) {
            unbalancedConstitutions.push(`${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} Yes`);
          } else if (score >= 30 && score < 40) {
            unbalancedConstitutions.push(`${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} Tend to`);
          }
        }
      }
      return unbalancedConstitutions;
    }
  }
  
  module.exports = { calculateScores, determineConstitution };
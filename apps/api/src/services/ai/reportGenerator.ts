export interface GeneratedReport {
  prediction: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  symptoms: string; // JSON String of { visible: string[], hidden: string[] }
  causes: string;
  treatment: string;
  organicRemedy: string;
  prevention: string;
}

interface DiseaseInfo {
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  symptoms: { visible: string[]; hidden: string[] };
  causes: string;
  treatment: string;
  organicRemedy: string;
  prevention: string;
}

export class ReportGeneratorService {
  private static DISEASE_LIBRARY: Record<string, DiseaseInfo> = {
    'Tomato Late Blight': {
      severity: 'Critical',
      summary: 'Late Blight is a highly destructive fungal disease caused by the pathogen Phytophthora infestans. It thrives in cool, wet environments and can destroy entire tomato fields in just a few days if left untreated.',
      symptoms: {
        visible: ['Dark water-soaked spots on leaves that turn brown or black.', 'A fuzzy white fungal growth on the underside of infected leaves in humid weather.', 'Large, irregular leathery brown lesions on the tomato fruit.'],
        hidden: ['Systemic vascular decay causing stem collapse.', 'Fungal spores migrating downwards to infect underground tubers.'],
      },
      causes: 'Pathogen Phytophthora infestans, high humidity (above 90%), cool weather (15-22°C), and leaves remaining wet for extended periods.',
      treatment: 'Apply metalaxyl-M or chlorothalonil immediately. Spray interval should be 7-10 days under wet conditions. Ensure safety gear is worn during application.',
      organicRemedy: 'Spray copper-based organic fungicides. Use compost tea to inoculate soil with beneficial microbes. Spray dilute Neem oil (0.5%) to inhibit spore germination.',
      prevention: 'Ensure proper plant spacing for aeration. Water plants at the base (drip irrigation) to keep leaves dry. Practice crop rotation with non-solanaceous crops.',
    },
    'Paddy Rice Blast': {
      severity: 'High',
      summary: 'Rice Blast is a severe fungal disease caused by Magnaporthe oryzae. It affects all aboveground parts of the rice plant (leaves, neck, and node) causing leaf drying and neck rot, leading to severe yield drops.',
      symptoms: {
        visible: ['Spindle-shaped or diamond-shaped lesions on leaves with gray centers and reddish-brown borders.', 'Neck rot causing the panicle to fall over and turn white.'],
        hidden: ['Vascular blocking in node tissues hindering silica uptake.'],
      },
      causes: 'Pathogen Magnaporthe oryzae, high nitrogen fertilizer application, cloudy skies, and leaf moisture.',
      treatment: 'Apply tricyclazole or azoxystrobin fungicides at the leaf blast or early heading stages.',
      organicRemedy: 'Apply Trichoderma bio-fungicide formulations. Spray Pseudomonas fluorescens suspension to strengthen crop resistance.',
      prevention: 'Avoid excessive nitrogen fertilization. Use blast-resistant rice seed varieties. Burn infected straw stubble after harvest to kill overwintering fungi.',
    },
    'Cotton Leaf Curl': {
      severity: 'Critical',
      summary: 'Cotton Leaf Curl Virus (CLCuV) is a devastating viral disease transmitted by the silverleaf whitefly. It results in leaf curling, vein thickening, and severe plant stunting, which drops fiber quality.',
      symptoms: {
        visible: ['Upward or downward curling of leaf margins.', 'Thickening of leaf veins.', 'Cup-shaped leaf-like outgrowths (enations) on the underside of leaves.'],
        hidden: ['Hormonal imbalance reducing gibberellin synthesis, leading to stunting.'],
      },
      causes: 'Cotton Leaf Curl Virus, high population density of whitefly vectors (Bemisia tabaci), and volunteer host weeds.',
      treatment: 'There is no direct chemical cure for the virus. Apply systemic insecticides like imidacloprid or acetamiprid to control the whitefly vectors.',
      organicRemedy: 'Spray neem oil or yellow sticky card traps to capture whiteflies. Apply home-made insecticidal soap sprays.',
      prevention: 'Clean weeds around boundaries. Plant border crops like maize or sorghum to block whitefly migrations. Grow CLCuV-resistant cotton hybrids.',
    },
    'Wheat Leaf Rust': {
      severity: 'Medium',
      summary: 'Wheat Leaf Rust (caused by Puccinia triticina) is a fungal disease that impairs photosynthesis and water transport, causing premature leaf death and shriveled grains.',
      symptoms: {
        visible: ['Small, oval orange-brown powdery pustules on the upper leaf surface.', 'Yellowing (chlorosis) surrounding the rusty pustules.'],
        hidden: ['Stomatal disruption causing high water transpiration and dehydration.'],
      },
      causes: 'Pathogen Puccinia triticina, warm temperatures (15-25°C), and dew or rain on wheat foliage.',
      treatment: 'Apply triazole fungicides like tebuconazole or propiconazole at the first sign of rust pustules.',
      organicRemedy: 'Spray diluted sulfur formulations. Spray aqueous extracts of garlic or ginger to reduce rust spore activity.',
      prevention: 'Sow rust-resistant varieties. Adjust planting date to avoid late-season warmth that accelerates rust propagation.',
    },
    'Healthy Crop Leaf': {
      severity: 'Low',
      summary: 'No disease detected. The leaf displays robust chlorophyll concentrations, active vascular transport, and no signs of bacterial, fungal, or insect patholeisons.',
      symptoms: {
        visible: ['Uniform green coloration across entire leaf area.', 'Firm, turgid stems and leaves with no spots or lesions.'],
        hidden: ['Active photosynthesis and balanced transpiration.'],
      },
      causes: 'Proper soil NPK fertilization, adequate watering, and clean farming sanitation practices.',
      treatment: 'No fungicide or chemical treatments required. Maintain current watering and fertilizing schedules.',
      organicRemedy: 'Continue applying standard compost manure and organic bio-fertilizers to sustain soil health.',
      prevention: 'Sustain weekly scoutings. Clean pruning shears between plants. Monitor weather for incoming humidity spikes.',
    },
  };

  public static generateReport(prediction: string): GeneratedReport {
    // 1. Direct match in dictionary
    if (this.DISEASE_LIBRARY[prediction]) {
      const info = this.DISEASE_LIBRARY[prediction];
      return {
        prediction,
        severity: info.severity,
        summary: info.summary,
        symptoms: JSON.stringify(info.symptoms),
        causes: info.causes,
        treatment: info.treatment,
        organicRemedy: info.organicRemedy,
        prevention: info.prevention,
      };
    }

    const lower = prediction.toLowerCase();
    const isHealthy = lower.includes('healthy');

    // Extract plant name from "Crop - Disease" or "Crop___Disease"
    const parts = prediction.split(/-|___/);
    const plantName = parts[0]?.trim() || 'Plant';
    const conditionName = parts[1]?.trim() || (isHealthy ? 'Healthy' : 'Foliar Disorder');

    if (isHealthy) {
      return {
        prediction,
        severity: 'Low',
        summary: `Your ${plantName} foliage exhibits healthy coloration, vigorous cellular structure, and no visible pathogen infections.`,
        symptoms: JSON.stringify({
          visible: ['Uniform chlorophyll distribution across leaf blade.', 'Absence of fungal pustules, necrotic spots, or vector damage.'],
          hidden: ['Vigorous vascular transport and active transpiration.'],
        }),
        causes: 'Optimal microclimate, balanced fertilization, and good soil moisture levels.',
        treatment: 'No chemical fungicides or insecticides required. Maintain standard irrigation and nutrient cycles.',
        organicRemedy: 'Continue foliar seaweed extract or compost tea application every 14 days to bolster systemic resistance.',
        prevention: 'Maintain routine crop scouting and inspect leaf undersides weekly for early insect or fungal onset.',
      };
    }

    // Determine severity based on condition keywords
    let severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
    if (lower.includes('late blight') || lower.includes('virus') || lower.includes('greening') || lower.includes('rot')) {
      severity = 'Critical';
    } else if (lower.includes('early blight') || lower.includes('bacterial') || lower.includes('cercospora') || lower.includes('blast')) {
      severity = 'High';
    } else if (lower.includes('rust') || lower.includes('mold') || lower.includes('mildew') || lower.includes('scab') || lower.includes('spot')) {
      severity = 'Medium';
    }

    // Determine targeted chemical & organic treatments
    let treatment = 'Apply broad-spectrum protective fungicide (Mancozeb 75% WP @ 2.5 g/L or Copper Oxychloride 50% WP @ 3 g/L). For advanced fungal spread, spray systemic Azoxystrobin + Difenoconazole @ 1 ml/L.';
    let organicRemedy = 'Foliar spray of cold-pressed Neem oil (5 ml/L water with mild soap emulsifier). Apply bio-agent Trichoderma viride or Bacillus subtilis @ 5 g/L at root zone and foliage.';
    let prevention = 'Practice crop rotation with non-host crops. Ensure adequate spacing for canopy airflow. Implement drip irrigation to avoid wet foliage.';

    if (lower.includes('bacterial')) {
      treatment = 'Spray Streptocycline (1 g/10 L) mixed with Copper Oxychloride (2.5 g/L). Avoid handling plants when wet.';
      organicRemedy = 'Copper hydroxide organic formulation. Apply biocontrol agent Pseudomonas fluorescens foliar spray.';
    } else if (lower.includes('virus') || lower.includes('curl')) {
      treatment = 'No chemical cure for plant viruses. Control insect vectors (whiteflies/aphids) using Imidacloprid 17.8% SL @ 0.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L.';
      organicRemedy = 'Install yellow sticky traps (15-20 per acre). Spray 2% Neem oil solution weekly to deter sap-sucking vectors.';
    } else if (lower.includes('mite')) {
      treatment = 'Apply acaricide/miticide such as Spiromesifen 22.9% SC @ 1 ml/L or Propargite 57% EC @ 2 ml/L.';
      organicRemedy = 'Spray wettable sulfur (2 g/L) or botanical insecticidal soap. Introduce predatory mites (Phytoseiidae).';
    }

    return {
      prediction,
      severity,
      summary: `${conditionName} identified on ${plantName}. This pathology impacts leaf photosynthesis and requires swift intervention to safeguard crop yield.`,
      symptoms: JSON.stringify({
        visible: [
          `Visible ${conditionName.toLowerCase()} lesions and localized chlorosis on ${plantName} foliage.`,
          'Premature yellowing and potential leaf margin curling or desiccation.'
        ],
        hidden: ['Reduced photosynthetic efficiency and compromised vascular translocation.'],
      }),
      causes: `Foliar pathogen proliferation favored by warm temperatures, elevated relative humidity, and moisture retention on leaves.`,
      treatment,
      organicRemedy,
      prevention,
    };
  }
}

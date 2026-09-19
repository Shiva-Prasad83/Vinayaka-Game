// Central registry of all missions across all 5 levels
// type: collect | talk | decorate | place | invite | clean | prepare | puzzle | rhythm | timed

export const MISSIONS = {
  // ── TUTORIAL ─────────────────────────────────────────────────────────
  tutorial_move: {
    id: 'tutorial_move', title: 'Learn to Move', level: 0,
    description: 'Move around using the joystick or WASD.',
    target: 1, reward: 0, type: 'tutorial',
  },
  tutorial_interact: {
    id: 'tutorial_interact', title: 'Interact', level: 0,
    description: 'Approach the mouse companion and press INTERACT.',
    target: 1, reward: 50, type: 'tutorial',
  },

  // ── LEVEL 1 — HOME ───────────────────────────────────────────────────
  l1_choose_ganesha: {
    id: 'l1_choose_ganesha', title: 'Choose Ganesha Idol', level: 1,
    description: 'Choose your Ganesha idol for the festival.',
    target: 1, reward: 100, type: 'place',
  },
  l1_place_idol: {
    id: 'l1_place_idol', title: 'Place the Idol', level: 1,
    description: 'Place the Ganesha idol on the decorated platform.',
    target: 1, reward: 100, type: 'place',
  },
  l1_collect_flowers: {
    id: 'l1_collect_flowers', title: 'Collect Flowers', level: 1,
    description: 'Collect 8 flowers for the decoration.',
    target: 8, reward: 100, type: 'collect', ecoReward: 50,
  },
  l1_decorate: {
    id: 'l1_decorate', title: 'Decorate the Area', level: 1,
    description: 'Place 4 decorations around the idol.',
    target: 4, reward: 200, type: 'decorate',
  },
  l1_diyas: {
    id: 'l1_diyas', title: 'Place Diyas', level: 1,
    description: 'Light 3 diyas for the festival.',
    target: 3, reward: 100, type: 'place',
  },
  l1_modaks: {
    id: 'l1_modaks', title: 'Prepare Modaks', level: 1,
    description: 'Prepare 5 modaks as festival offering.',
    target: 5, reward: 100, type: 'prepare',
  },

  // ── LEVEL 2 — STREET ─────────────────────────────────────────────────
  l2_invite_people: {
    id: 'l2_invite_people', title: 'Invite Neighbors', level: 2,
    description: 'Invite 5 families to the festival.',
    target: 5, reward: 100, type: 'invite',
  },
  l2_collect_flowers: {
    id: 'l2_collect_flowers', title: 'Collect Street Flowers', level: 2,
    description: 'Collect 10 flowers from the street.',
    target: 10, reward: 100, type: 'collect', ecoReward: 50,
  },
  l2_clean_street: {
    id: 'l2_clean_street', title: 'Clean the Street', level: 2,
    description: 'Clean 5 areas of the street.',
    target: 5, reward: 100, type: 'clean', ecoReward: 100,
  },
  l2_help_children: {
    id: 'l2_help_children', title: 'Help the Children', level: 2,
    description: 'Help 3 children with their festival preparations.',
    target: 3, reward: 100, type: 'talk',
  },

  // ── LEVEL 3 — MARKET ─────────────────────────────────────────────────
  l3_buy_flowers: {
    id: 'l3_buy_flowers', title: 'Collect Flowers', level: 3,
    description: 'Collect 5 flowers from the market.',
    target: 5, reward: 100, type: 'collect',
  },
  l3_buy_diyas: {
    id: 'l3_buy_diyas', title: 'Collect Diyas', level: 3,
    description: 'Collect 3 diyas from the market.',
    target: 3, reward: 100, type: 'collect',
  },
  l3_buy_decorations: {
    id: 'l3_buy_decorations', title: 'Collect Decorations', level: 3,
    description: 'Collect 3 decorations from the market.',
    target: 3, reward: 100, type: 'collect',
  },
  l3_buy_modaks: {
    id: 'l3_buy_modaks', title: 'Collect Modaks', level: 3,
    description: 'Collect 5 modaks from the market.',
    target: 5, reward: 100, type: 'collect',
  },
  l3_talk_seller: {
    id: 'l3_talk_seller', title: 'Talk to Sellers', level: 3,
    description: 'Talk to 3 different market sellers.',
    target: 3, reward: 100, type: 'talk',
  },

  // ── LEVEL 4 — TEMPLE ─────────────────────────────────────────────────
  l4_decorate_temple: {
    id: 'l4_decorate_temple', title: 'Decorate Temple', level: 4,
    description: 'Place 5 decorations around the temple.',
    target: 5, reward: 100, type: 'decorate',
  },
  l4_flower_arrangement: {
    id: 'l4_flower_arrangement', title: 'Flower Arrangement', level: 4,
    description: 'Arrange flowers at 3 positions.',
    target: 3, reward: 100, type: 'place',
  },
  l4_puzzle: {
    id: 'l4_puzzle', title: 'Decoration Puzzle', level: 4,
    description: 'Complete the temple decoration puzzle.',
    target: 1, reward: 100, type: 'puzzle',
  },
  l4_music: {
    id: 'l4_music', title: 'Music Challenge', level: 4,
    description: 'Complete the music rhythm challenge.',
    target: 1, reward: 100, type: 'rhythm',
  },
  l4_modak_challenge: {
    id: 'l4_modak_challenge', title: 'Modak Challenge', level: 4,
    description: 'Collect 10 modaks in 20 seconds.',
    target: 10, reward: 100, type: 'timed',
  },

  // ── LEVEL 5 — GRAND FESTIVAL ─────────────────────────────────────────
  l5_place_centerpiece: {
    id: 'l5_place_centerpiece', title: 'Place Grand Idol', level: 5,
    description: 'Place the grand Ganesha centerpiece.',
    target: 1, reward: 200, type: 'place',
  },
  l5_light_stage: {
    id: 'l5_light_stage', title: 'Light the Stage', level: 5,
    description: 'Light 6 festival lights on the stage.',
    target: 6, reward: 100, type: 'place',
  },
  l5_invite_musicians: {
    id: 'l5_invite_musicians', title: 'Invite Musicians', level: 5,
    description: 'Invite 4 musicians to perform.',
    target: 4, reward: 100, type: 'invite',
  },
  l5_final_decoration: {
    id: 'l5_final_decoration', title: 'Final Decoration', level: 5,
    description: 'Complete the grand festival decoration.',
    target: 8, reward: 200, type: 'decorate', ecoReward: 100,
  },
  l5_celebrate: {
    id: 'l5_celebrate', title: 'Celebrate!', level: 5,
    description: 'Join the festival celebration.',
    target: 1, reward: 1000, type: 'celebrate',
  },
};

// Ordered mission sequences per level
export const LEVEL_MISSIONS = {
  0: ['tutorial_move', 'tutorial_interact'],
  1: ['l1_choose_ganesha', 'l1_place_idol', 'l1_collect_flowers', 'l1_decorate', 'l1_diyas', 'l1_modaks'],
  2: ['l2_invite_people', 'l2_collect_flowers', 'l2_clean_street', 'l2_help_children'],
  3: ['l3_buy_flowers', 'l3_buy_diyas', 'l3_buy_decorations', 'l3_buy_modaks', 'l3_talk_seller'],
  4: ['l4_decorate_temple', 'l4_flower_arrangement', 'l4_puzzle', 'l4_music', 'l4_modak_challenge'],
  5: ['l5_place_centerpiece', 'l5_light_stage', 'l5_invite_musicians', 'l5_final_decoration', 'l5_celebrate'],
};

export const getFirstMission = (level) => LEVEL_MISSIONS[level]?.[0] ?? null;

export const getNextMission = (level, completedMissions) => {
  const list = LEVEL_MISSIONS[level] ?? [];
  return list.find((id) => !completedMissions.includes(id)) ?? null;
};

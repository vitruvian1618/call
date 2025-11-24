import { Questionnaire } from '../models/questionnaire.model.js';

export const questionnaire: Questionnaire = {
  version: 'DL_v1_MVP',
  firstQuestionId: 'q1',
  questions: [
    {
      id: 'q1',
      code: 'INTRO',
      text: 'Pozdravljeni! Začnimo s kratkim testnim intervjujem. Ste pripravljeni na nekaj vprašanj?',
      next: 'q2',
    },
    {
      id: 'q2',
      code: 'SAT_SCORE',
      text: 'Kako bi na lestvici od ena do pet ocenili vašo zadnjo izkušnjo z nami?',
      options: [
        { code: '1', label: '1' },
        { code: '2', label: '2' },
        { code: '3', label: '3' },
        { code: '4', label: '4' },
        { code: '5', label: '5' },
      ],
      next: 'q3',
    },
    {
      id: 'q3',
      code: 'ISSUE_TYPE',
      text: 'Kakšen je bil glavni razlog, da ste se obrnili na našo podporo?',
      options: [
        { code: 'TECH', label: 'Težave s tehnologijo' },
        { code: 'BILL', label: 'Vprašanja glede računa ali plačil' },
        { code: 'SERVICE', label: 'Splošna uporabniška izkušnja' },
        { code: 'OTHER', label: 'Nekaj drugega' },
      ],
      next: 'q4',
    },
    {
      id: 'q4',
      code: 'CALLBACK',
      text: 'Želite, da vas kdo od naših svetovalcev pokliče nazaj?',
      options: [
        { code: 'YES', label: 'Da' },
        { code: 'NO', label: 'Ne' },
      ],
    },
  ],
};

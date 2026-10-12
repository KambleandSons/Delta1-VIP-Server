import { useState } from 'react';
import { useApp } from '../context/AppContext';

const COURSES = [
  {
    id: "honest-close", n: 1, title: "The Honest Close", tradition: "Zig Ziglar", minutes: 45, color: "#E8463A",
    tag: "Selling is helping. The close is the natural end of a conversation that went well.",
    who: "Everyone who talks to a prospect about Delta One.",
    outcome: "You can run a first conversation from a warm opening to a small, specific next step, without pressure and without a single promise.",
    lessons: [
      { t: "Selling is helping", text: "The oldest idea in selling: you get what you want by helping enough other people get what they want. A Delta One conversation is a service: you bring a plan, honest numbers and a real warning. Nobody has to buy; your job is to make sure they understand.", ex: "Write one sentence: what does this person actually want? Not what you want them to buy." },
      { t: "Trust before numbers", text: "People decide to trust you in the first minute and decide about the plan much later. Say the honest frame first — a software purchase, an average, not guaranteed, most members earn no commission — and watch what it does to the rest of the talk.", ex: "Open your next conversation with the disclosure line, in your own words, before any figure." },
      { t: "The question ladder", text: "The person asking questions leads the conversation, and the person who talks less learns more. Build a ladder: what do you do, what would you change, what have you tried, what would a result like this mean for you?", ex: "Prepare five questions and hold a ten-minute conversation where you speak less than half the time." },
      { t: "Objections are requests for information", text: "An objection means the prospect is still listening. Welcome it, ask what is behind it, answer with the document and the page, and confirm the answer landed. 'Is it guaranteed?' is the best question you will ever get: answer no, and explain why that honesty protects them.", ex: "List the five objections you hear most and write the document and page that answers each." },
      { t: "Ask for the next step", text: "The close is a small, specific action with a time attached: read the Key Facts tonight, ten minutes on Zoom Thursday. Ask warmly, then be quiet. Silence is not pressure; it is respect.", ex: "End your next three conversations with one question and then say nothing until they answer." },
      { t: "Follow-through is the sale", text: "Most decisions happen after the conversation. The follow-up message, the document you promised, the call at the time you said: the follow-through is where trust is proven. Use the Follow-Up Messages and the Contacts list; let nothing wait more than two days.", ex: "Set a follow-up date on every open contact in your dashboard today." }
    ]
  },
  {
    id: "psychology-of-yes", n: 2, title: "The Psychology of the Yes", tradition: "Brian Tracy", minutes: 50, color: "#1F6FEB",
    tag: "People buy from people they like and trust, and they buy for their reasons, not yours.",
    who: "Members who want a repeatable way to prospect and to listen.",
    outcome: "A weekly prospecting rhythm, a listening habit, and a written goal you can measure.",
    lessons: [
      { t: "The friendship factor", text: "A prospect will not act on a plan until they feel the seller is on their side. Warmth is not a technique; it is the decision to care about the outcome for them, including the decision not to buy.", ex: "Tell one prospect this week, sincerely, that not buying is fine. Notice what changes." },
      { t: "Listening as persuasion", text: "Ask a question, listen without interrupting, pause before you answer, and ask a clarifying question before you explain anything.", ex: "In your next conversation, count the seconds of silence after each answer. Aim for two." },
      { t: "Prospecting by the numbers", text: "Most of your results will come from a small part of your activity. Keep a list that never drops below thirty names, talk to three people a day, and track it.", ex: "Open Contacts, add names until you have thirty, and set a date on each." },
      { t: "Goals in writing", text: "A goal that is written, measured and dated changes behaviour; a wish does not. Use the Fast Start planner: a rank, a date, the lines it needs.", ex: "Fill the Fast Start planner with your 90-day goal and read it aloud once." },
      { t: "Energy and time", text: "Selling is an energy business. Protect the hours when you are at your best for conversations, do the paperwork when you are not.", ex: "Block two 'conversation hours' in your calendar for the week." },
      { t: "The honest ambition", text: "Ambition is good; promising is not. Want a lot, say little: every figure is an illustration at the average, and most members earn no commission at all.", ex: "Write your own one-line disclosure and keep it on your phone." }
    ]
  },
  {
    id: "seasons", n: 3, title: "The Seasons of Success", tradition: "Jim Rohn", minutes: 40, color: "#0FB5A4",
    tag: "Work harder on yourself than on your business, and the business follows.",
    who: "Members building a long game: leaders of lines.",
    outcome: "A personal philosophy you can say in a minute, and a discipline you can keep.",
    lessons: [
      { t: "Your philosophy", text: "What you believe about money, work and people decides what you do every day. Write it down: a module is a purchase, rewards come from volume you helped build.", ex: "Write your philosophy in five sentences and read it to one person." },
      { t: "The seasons", text: "There is a season to plant, a season to tend, a season to reap, and a winter. You cannot change the seasons; you can change what you do in each one.", ex: "Name the season you are in now, and the one thing that season asks of you." },
      { t: "Discipline weighs ounces, regret weighs tons", text: "Three conversations a day is light. Not doing them for a month is heavy. Small disciplines, kept daily, are the whole secret.", ex: "Choose one daily discipline for the next seven days and tick it in the planner." },
      { t: "Goals: the wheel and the sail", text: "A goal is not a wish; it is a direction with a date. Set the rank, the date and the lines; then let the daily activity do the rest.", ex: "Set your day-90 goal in the planner and tell your sponsor." },
      { t: "Attitude is the lens", text: "Results at the average take about two hundred days to return a price; a plan takes months to build. Patience is an attitude you choose each morning.", ex: "Write down the last three things that went wrong and the lesson in each." },
      { t: "Lifestyle: what it was all for", text: "Rewards are for a life, not for a scoreboard. Decide early what a good month would let you do, with whom.", ex: "Describe your 'why' in two sentences on your landing page draft." }
    ]
  },
  {
    id: "think-decide-persist", n: 4, title: "Think, Decide, Persist", tradition: "Napoleon Hill", minutes: 45, color: "#8A5E00",
    tag: "A definite aim, a decision made once, and persistence through the quiet weeks.",
    who: "Anyone who has started well and stopped — and wants to stop stopping.",
    outcome: "One definite aim written and dated, a mastermind of three, and a persistence plan for the dip.",
    lessons: [
      { t: "A definite chief aim", text: "Vague wanting produces vague days. Write the exact rank, the exact date, the exact lines, and what you will do each week to earn them.", ex: "Write your definite aim on one card and photograph it." },
      { t: "Belief, built on facts", text: "Belief is knowing the plan cold: the 2% per level, the seven ranks, the line balance rule, the 2× limit, and the honest disclosure.", ex: "Take the Certified Compensation Plan Master test. Belief begins with knowing." },
      { t: "Decision", text: "Successful people decide quickly and change their minds slowly; the others do the opposite. Decide once: the rhythm, the list, the standard.", ex: "Make three decisions today about how you will work, and write them down." },
      { t: "Persistence", text: "Every member hits the dip: week five, few replies, one 'no' that stung. Persistence is a plan made before the dip.", ex: "Write your dip plan: three actions and one person to call." },
      { t: "The mastermind", text: "Two or three people meeting weekly, sharing numbers honestly and solving each other's problems, outperform any lone climber.", ex: "Book a 15-minute weekly call with two people from your team." },
      { t: "Going the extra mile", text: "Do more than is expected, and do it with a good attitude, and the plan will pay you later in ways you did not plan.", ex: "Do one unasked, useful thing for a member this week." }
    ]
  },
  {
    id: "become-what-you-think", n: 5, title: "You Become What You Think About", tradition: "Earl Nightingale", minutes: 35, color: "#5B3FB8",
    tag: "A goal held in the mind each day shapes the day. Thirty days changes a habit.",
    who: "Members starting their first 90 days.",
    outcome: "A goal card, a thirty-day practice and a service-first attitude you can feel in your conversations.",
    lessons: [
      { t: "Thought is the seed", text: "Plant the rank, the date and the names on purpose, every morning, or the day's noise plants itself.", ex: "Decide what you will think about for the first five minutes of each morning this week." },
      { t: "The goal card", text: "Write one goal on a card, carry it, and read it when you wake and when you sleep.", ex: "Write the card. Put it in your wallet." },
      { t: "Thirty days", text: "Commit to thirty days of the practice — the card, three conversations a day, the follow-ups — and judge nothing before day thirty.", ex: "Start the thirty days today and mark day one in the planner." },
      { t: "Attitude", text: "Bring calm, interest and honesty to a conversation and you get them back; bring urgency and you get resistance.", ex: "Before each call, take one breath and decide the attitude you bring." },
      { t: "The river and the goal", text: "A person with a goal is a boat with a rudder; a person without one drifts with the current and calls it luck.", ex: "Check: is today's activity pointed at the goal, or drifting?" },
      { t: "Service first", text: "Rewards are in proportion to the service rendered. Help a member understand the plan, sit with them on day eleven.", ex: "List three ways you served your team this week." }
    ]
  },
  {
    id: "people-first", n: 6, title: "People First", tradition: "Dale Carnegie", minutes: 45, color: "#14A05C",
    tag: "Become genuinely interested in people, and people become interested in what you do.",
    who: "Everyone. This is the course to take first if conversations feel hard.",
    outcome: "Six habits that make people glad they talked to you — and willing to talk again.",
    lessons: [
      { t: "Genuine interest", text: "You can make more friends in two months by becoming interested in other people than in two years by trying to get people interested in you.", ex: "Have one conversation this week in which you learn five things and sell nothing." },
      { t: "Names", text: "A person's name is the sweetest sound they know. Learn it, use it, spell it right in the message.", ex: "Add a note to five contacts with one personal detail each." },
      { t: "Talk in terms of their interests", text: "Nobody cares about ranks; they care about what a rank would let them do. Find the interest first.", ex: "Rewrite your opening line around the other person's interest, not the product." },
      { t: "Never argue", text: "You cannot win an argument; even when you win, you lose the person. When a prospect says something wrong, ask a question.", ex: "Next time you feel the urge to correct, ask a question instead." },
      { t: "Honest appreciation", text: "Tell a member exactly what they did well: the disclosure said clearly, the follow-up sent on time.", ex: "Send three specific appreciations to your team today." },
      { t: "Let the other person save face", text: "A member who misses a review, a prospect who said no: leave the door open and the dignity intact.", ex: "Write the message you would send to someone who said no." }
    ]
  },
  {
    id: "speak-so-they-listen", n: 7, title: "Speak So They Listen", tradition: "Classical public speaking", minutes: 60, color: "#0B4FB8",
    tag: "One message, a clear shape, a story, a pause. Nerves are energy wearing the wrong coat.",
    who: "Members who present the plan to groups — a living room, a Zoom, a hall.",
    outcome: "A five-minute napkin talk and a twenty-minute presentation you can give from memory, honestly.",
    lessons: [
      { t: "Nerves into energy", text: "Breathe out slowly before you start, plant your feet, look at one kind face, and begin with a sentence you know by heart.", ex: "Memorise your first sentence and say it aloud ten times." },
      { t: "One message", text: "A software purchase that pays its owner a share of real trading profit, and pays you on what your organisation's contracts earn — with nothing promised.", ex: "Write your one sentence. Cut every word that does not earn its place." },
      { t: "The three-part shape", text: "Tell them what you will tell them; tell them; tell them what you told them.", ex: "Outline your talk in nine lines: three for each part." },
      { t: "Stories and pictures", text: "People remember stories and forget bullet points. The cartoon, Maya and Sam, the seed farm.", ex: "Prepare one true, short story for each of your three points." },
      { t: "Voice, pause, pace", text: "Speak more slowly than feels natural, vary the volume, and use the pause as punctuation.", ex: "Record two minutes of yourself. Listen for the pauses." },
      { t: "The napkin talk", text: "Five minutes, one napkin: buy a module; the 100-USDT split; balanced lines; paid two ways; the disclosure.", ex: "Draw the napkin from memory three times, timing yourself." }
    ]
  },
  {
    id: "networkers-garden", n: 8, title: "The Networker's Garden", tradition: "The relationship school", minutes: 45, color: "#087F73",
    tag: "Dig the well before you are thirsty. Give first, follow up always, build wide.",
    who: "Members who want a network that keeps producing names.",
    outcome: "A living list, a follow-up habit, and a way of meeting people that leaves them better off.",
    lessons: [
      { t: "Give first", text: "A network is not a list of people who owe you; it is a list of people you have helped. Share an introduction, a tip, a kind word.", ex: "Do three favours this week for people who cannot repay you soon." },
      { t: "Your list of fifty", text: "Everyone knows fifty people; most never write them down. The list is the garden; the conversations are the water.", ex: "Write fifty names in Contacts today, with no decision about any of them." },
      { t: "The follow-up habit", text: "The fortune is in the follow-up. Two days after a conversation, a message; a week later, a document.", ex: "Set follow-up dates on every contact without one." },
      { t: "Introductions", text: "The best way to meet someone is to be introduced by someone they trust. Ask your warmest contacts: 'Who do you know who would enjoy this?'", ex: "Ask three people for one introduction each." },
      { t: "Rooms and events", text: "Arrive early, leave late, talk to the people standing alone, and collect three names, not thirty.", ex: "Attend one event this month with a three-name goal." },
      { t: "Build wide", text: "Open new lines on purpose — new circles, new cities, new languages. Width is safety, and the line balance rule rewards it.", ex: "Name two circles you have never approached, and one person in each." }
    ]
  },
  {
    id: "presenters-toolkit", n: 9, title: "The Presenter's Toolkit", tradition: "Delta One documents workshop", minutes: 40, color: "#FFB400",
    tag: "The right tool for the moment: cartoon, one page, presentation, Zoom — and the disclosure at every one.",
    who: "Members who present the plan one-to-one or on Zoom every week.",
    outcome: "You choose the right tool for each conversation and run a clean Zoom with questions handled honestly.",
    lessons: [
      { t: "Choose the tool", text: "Coffee: the napkin. A curious friend: the cartoon. A serious prospect: the 17 slides. A careful one: the Momentum Plan Guide.", ex: "Match each of your last five prospects to the tool you should have used." },
      { t: "The first minute", text: "Who you are, why you are showing this, and the honest frame — a software purchase, an average, nothing guaranteed.", ex: "Write and time your first minute. Under sixty seconds, every word true." },
      { t: "Walking the one-page plan", text: "7 Summits to Success is the whole plan on one page: walk it top to bottom, and stop at the line balance rule.", ex: "Explain the one-page plan to someone in four minutes, without notes." },
      { t: "Questions and objections, live", text: "Repeat the question, answer with the document and page, and never guess a figure. 'I do not know; I will find out' is a strong answer.", ex: "Prepare answers for the ten most common questions." },
      { t: "Zoom craft", text: "Camera at eye level, light in front, presentation shared from the library, Key Facts link in the chat.", ex: "Run a practice Zoom with a team member." },
      { t: "Close with a next step", text: "Every presentation ends with one specific next step and a time: read Key Facts tonight, ten-minute call Thursday.", ex: "Script three different next steps for three different styles." }
    ]
  },
  {
    id: "leading-volunteers", n: 10, title: "Leading a Team of Volunteers", tradition: "Servant leadership", minutes: 50, color: "#44587A",
    tag: "Nobody on your team works for you. They work with you, as long as you deserve it.",
    who: "Sponsors at Fuji and above, and anyone who wants to be one.",
    outcome: "A weekly rhythm, a coaching habit matched to each person's style, and a standard of honesty your team copies.",
    lessons: [
      { t: "Leaders go first", text: "You cannot ask for a discipline you do not keep: three conversations a day, follow-ups, certification.", ex: "Take the Certified Compensation Plan Master test before you ask your team to." },
      { t: "Recognition", text: "People leave teams where they feel invisible. Recognise the small things publicly: a first conversation, a checkpoint passed.", ex: "Send one recognition to every member of your team this week." },
      { t: "Coach by style", text: "A Summiteer wants a target and room; a Storyteller wants praise; an Anchor wants routine; a Mapmaker wants the document.", ex: "Write one coaching sentence per team style." },
      { t: "Duplication", text: "Your team cannot copy what is complicated. The hallway — watch, read, do — is the whole system.", ex: "Run the 45-minute teaching session with one new member this week." },
      { t: "Honest standards", text: "Set the standard the first week: disclosure in every conversation, no figure you cannot show.", ex: "Write your team's five standards and read them at your next call." },
      { t: "The weekly rhythm", text: "Same day, same hour: fifteen minutes of numbers, ten minutes of training, five minutes of recognition.", ex: "Set the weekly call and send the invitation today." }
    ]
  }
];

export default function SkillShop() {
  const { plan, openUpsell } = useApp();
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(() => {
    try { return JSON.parse(localStorage.getItem('d1courses') || '{}'); } catch { return {}; }
  });

  const activeCourse = COURSES.find(c => c.id === activeCourseId);

  function handleCourseClick(courseId) {
    if (plan === 'free') {
      openUpsell();
      return;
    }
    setActiveCourseId(courseId);
  }

  function toggleLesson(courseId, lessonIdx) {
    const list = completedLessons[courseId] || [];
    const nextList = list.includes(lessonIdx)
      ? list.filter(i => i !== lessonIdx)
      : [...list, lessonIdx];
    const nextObj = { ...completedLessons, [courseId]: nextList };
    setCompletedLessons(nextObj);
    try { localStorage.setItem('d1courses', JSON.stringify(nextObj)); } catch {}
  }

  return (
    <section className={`group${plan === 'free' ? ' vip-only' : ''}`} id="courses">
      <div className="group-head">
        <img src="/img/everest.jpg" alt="" width="180" height="186" />
        <div>
          <h2>The Skill Shop · learn from the greats</h2>
          <p>
            Ten courses on selling, networking, speaking and leading, taught by Aria in the tradition of the great teachers. Six lessons each, an exercise with every lesson, your progress saved to your training record.
          </p>
        </div>
      </div>

      {/* VIP Lock Card: Shown over the blurred courses when plan === 'free' */}
      <div className="vip-lock">
        <div className="vip-lock-card">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="var(--gold-ink)" aria-hidden="true">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
          </svg>
          <p className="doc-tag">Delta One VIP · 99 USDT a month</p>
          <h3>The Skill Shop: The Honest Close, People First, Speak So They Listen, The Networker's Garden and six more courses</h3>
          <p>
            Part of Delta One VIP, with your personal assistant, a live agent on Zoom 24/7, a concierge, your dashboard, your team's view and your contacts. Pay in USDT like a module, or from your rewards in the back office.
          </p>
          <a
            className="btn gold"
            href="#upgrade"
            data-upgrade="lib-courses"
            onClick={(e) => {
              e.preventDefault();
              openUpsell();
            }}
          >
            Go VIP · 99 USDT/month
          </a>
        </div>
      </div>

      {/* Courses Grid: blurred when in free mode via .plan-free .group.vip-only .docs */}
      <div className="docs courses-grid" id="courses-grid">
        {COURSES.map(c => {
          const doneList = completedLessons[c.id] || [];
          const doneCount = doneList.length;
          const totalCount = c.lessons.length;
          const pct = Math.round((doneCount / totalCount) * 100);

          return (
            <article key={c.id} className="course" style={{ '--cc': c.color }}>
              <p className="doc-tag">Course {c.n} · in the tradition of {c.tradition}</p>
              <h3>{c.title}</h3>
              <p className="plain">{c.tag}</p>
              <p className="doc-specs">
                {totalCount} lessons · about {c.minutes} minutes
                {doneCount > 0 ? ` · ${doneCount} of ${totalCount} done` : ''}
                {doneCount === totalCount ? ' · completed ✓' : ''}
              </p>
              <div className="bar"><i style={{ width: `${pct}%` }}></i></div>
              <div className="actions">
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => handleCourseClick(c.id)}
                >
                  {doneCount === totalCount ? 'Open again' : doneCount > 0 ? 'Continue' : 'Start'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {activeCourse && plan === 'vip' && (
        <div className="course-panel" id="course-panel">
          <div className="course-in" style={{ '--cc': activeCourse.color }}>
            <div className="course-top">
              <div>
                <p className="doc-tag">Course {activeCourse.n} · in the tradition of {activeCourse.tradition}</p>
                <h3>{activeCourse.title}</h3>
                <p className="plain">{activeCourse.tag}</p>
              </div>
              <button
                type="button"
                className="ask-x"
                aria-label="Close"
                onClick={() => setActiveCourseId(null)}
              >
                ✕
              </button>
            </div>
            <div className="course-meta">
              <p><b>For:</b> {activeCourse.who}</p>
              <p><b>When you finish:</b> {activeCourse.outcome}</p>
            </div>
            <div className="aria-say">
              <img src="/img/host.svg" alt="" />
              <p>Six short lessons. Read one, do its exercise, tick it. The exercise is the lesson; the reading is only the map.</p>
            </div>
            <ol className="lessons">
              {activeCourse.lessons.map((lesson, idx) => {
                const isDone = (completedLessons[activeCourse.id] || []).includes(idx);
                return (
                  <li key={idx} className={`lesson${isDone ? ' done' : ''}`}>
                    <div className="lesson-h">
                      <h4>{idx + 1}. {lesson.t}</h4>
                      <button
                        type="button"
                        className="btn ghost sm-btn"
                        onClick={() => toggleLesson(activeCourse.id, idx)}
                      >
                        {isDone ? '✓ Done' : 'Mark done'}
                      </button>
                    </div>
                    <p>{lesson.text}</p>
                    <p className="exercise"><b>Exercise.</b> {lesson.ex}</p>
                  </li>
                );
              })}
            </ol>
            <p className="course-foot">
              {(completedLessons[activeCourse.id] || []).length === activeCourse.lessons.length
                ? 'Course completed. It is in your training record; your sponsor can see it.'
                : `${(completedLessons[activeCourse.id] || []).length} of ${activeCourse.lessons.length} lessons done.`}
            </p>
          </div>
        </div>
      )}

      <p className="doc-specs" style={{ marginTop: '14px' }}>
        Original courses written for Delta One VIP, taught by Aria, drawing on the published ideas of the teachers named. Nothing is quoted; nothing is affiliated with, licensed by or endorsed by them or their companies. Every figure about the plan is an illustration at the engine's average daily result; results and rewards are not guaranteed, and most members earn no commission at all.
      </p>
    </section>
  );
}

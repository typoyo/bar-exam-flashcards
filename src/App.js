import React, { useState, useMemo } from 'react';

// --- Data for all flashcard decks ---
const allDecks = {
  agency: {
    subject: "Agency",
    cards: [
      { question: "Creating an Agency Relationship", answer: "Requires (1) Assent – principal and agent manifest assent; (2) Benefit – agent agrees to work for the principal’s benefit; and (3) Control – agent agrees to work subject to the principal’s control. No consideration is required." },
      { question: "What is Actual Authority?", answer: "Actual Express Authority is created by written or spoken words. Actual Implied Authority is when the agent takes necessary steps to achieve the principal’s objectives, including actions within accepted business custom." },
      { question: "What is Apparent Authority?", answer: "The principal creates apparent authority through words or conduct that cause a third party to reasonably believe the agent has authority. It exists until the principal notifies the third party." },
      { question: "What is Vicarious Liability (Respondeat Superior)?", answer: "An employer is liable for an employee's torts if: (1) the employer has the right to control the employee's acts, and (2) the tort was committed within the scope of employment. Distinguish between a minor 'detour' (liable) and a major 'frolic' (not liable)." },
    ]
  },
  civpro: {
    subject: "Civil Procedure",
    cards: [
      { question: "What are the two requirements for Personal Jurisdiction?", answer: "1. The basis for exercising PJ over an out-of-state defendant must be authorized by statute or court rule.\n2. The basis must be permitted by the Due Process Clause (i.e., minimum contacts)." },
      { question: "What are the requirements for Diversity Jurisdiction?", answer: "A U.S. District Court has diversity jurisdiction if (1) there is complete diversity (no plaintiff shares citizenship with any defendant) and (2) the amount in controversy exceeds $75,000." },
      { question: "What is the rule for Removal Jurisdiction?", answer: "A defendant can remove a case from state to federal court if the case could have originally been brought in federal court. All defendants must consent. If removal is based on diversity, no defendant can be a citizen of the state where the action was filed." },
      { question: "What is the Erie Doctrine?", answer: "In a diversity case, a federal court must apply the substantive law of the state in which it sits (including that state's choice-of-law rules) but will apply federal procedural law." },
      { question: "What are the requirements for Claim Preclusion (Res Judicata)?", answer: "A final judgment on the merits precludes successive litigation of an identical claim. Requires: (1) same parties (in the same roles), (2) same claim, and (3) a valid, final judgment on the merits." },
    ]
  },
  conflicts: {
    subject: "Conflicts of Laws",
    cards: [
        { question: "What is the Constitutional limitation on choice of law?", answer: "Under the Due Process Clause, a forum state may apply its own law only if it has a significant contact or aggregation of contacts such that the choice of its law is neither arbitrary nor fundamentally unfair." },
        { question: "What is the Full Faith & Credit Clause's role with judgments?", answer: "State courts are required to give full faith and credit to the judgments of other states, treating them as they would be treated by the courts of the original state." },
        { question: "What is the Vested Rights Approach (First Restatement)?", answer: "The law that controls is the law of the jurisdiction where the parties’ rights vested (i.e., where the act or relationship that gave rise to the cause of action occurred)." },
        { question: "What is the Most Significant Relationship Approach (Second Restatement)?", answer: "The law of the state with the most significant relationship to the matter at hand is applied, considering connecting facts and policy principles." },
        { question: "How are Torts cases handled under Conflicts of Law?", answer: "The default rule is that the law of the place of injury controls, unless another state has a more significant relationship to the parties or the tort." },
    ]
  },
  contracts: {
    subject: "Contracts & Sales",
    cards: [
      { question: "What are the essential terms under Common Law vs. UCC?", answer: "Common Law: All essential terms must be covered (parties, subject, price, quantity).\nUCC: Only quantity is essential. The UCC 'fills the gap' for other missing terms if the parties intended to contract." },
      { question: "What is the UCC Firm Offer Rule?", answer: "An offer by a merchant to buy or sell goods in a signed writing which gives assurance it will be held open is not revocable for lack of consideration for the time stated (or a reasonable time, max 3 months)." },
      { question: "What is Anticipatory Repudiation?", answer: "Occurs when a party unequivocally refuses to perform before performance is due. The non-repudiating party may treat it as an immediate breach and seek remedies." },
      { question: "What is the UCC 2-207 'Battle of the Forms'?", answer: "An acceptance with additional terms is still an acceptance. Between merchants, new terms become part of the contract unless: (1) the offer limits acceptance to its terms, (2) they materially alter the contract, or (3) the offeror objects in a reasonable time." },
    ]
  },
  corps: {
    subject: "Corporations",
    cards: [
        { question: "What is Promoter Liability?", answer: "A promoter is personally liable on pre-incorporation contracts. The promoter is only released from liability by a novation (an agreement between the third party, the corporation, and the promoter to substitute the corporation for the promoter)." },
        { question: "What is Piercing the Corporate Veil?", answer: "Courts may disregard the corporate entity and hold shareholders personally liable if they abuse the corporate form, such as by undercapitalization, commingling assets, or defrauding creditors." },
        { question: "What is the Business Judgment Rule (BJR)?", answer: "A rebuttable presumption that a director reasonably believed his actions were in the best interests of the corporation. It protects directors from liability for good-faith business decisions that turn out poorly." },
        { question: "What is a Director's Duty of Loyalty?", answer: "A director must act in the best interests of the corporation. This prohibits self-dealing (conflict-of-interest transactions) unless the transaction is protected by a safe-harbor provision (disclosure and approval by disinterested directors or shareholders, or fairness to the corp)." },
        { question: "What is a Derivative Action?", answer: "A lawsuit brought by a shareholder on behalf of the corporation, typically for a breach of fiduciary duty by directors. The shareholder must have standing and make a written demand on the board unless demand would be futile." },
    ]
  },
  crimlaw: {
    subject: "Criminal Law",
    cards: [
        { question: "What are the four types of Mens Rea?", answer: "1. Specific Intent: The intent to commit the act and cause the specific result.\n2. Malice: Reckless disregard of a high degree of harm.\n3. General Intent: The intent to perform an unlawful act.\n4. Strict Liability: No mental state required; the act itself is sufficient." },
        { question: "What is Accomplice Liability?", answer: "A person is an accomplice if they intentionally assist with the crime and act with the purpose of promoting or facilitating its commission. Mere knowledge is not enough." },
        { question: "What are the elements of Conspiracy?", answer: "1. An agreement between two or more people;\n2. to commit an unlawful act; and\n3. an overt act in furtherance of the conspiracy." },
        { question: "What is Felony Murder?", answer: "A killing that occurs during the commission or attempted commission of an inherently dangerous felony (usually Burglary, Arson, Rape, Robbery, Kidnapping - BARRK). Malice is implied from the intent to commit the underlying felony." },
        { question: "What are the elements of common law Burglary?", answer: "The breaking and entering of the dwelling of another at nighttime with the specific intent to commit a felony therein." },
    ]
  },
  crimpro: {
    subject: "Criminal Procedure",
    cards: [
        { question: "When are Miranda warnings required?", answer: "Miranda warnings are required before a suspect is subjected to a custodial interrogation. 'Custody' means a reasonable person would not feel free to leave. 'Interrogation' means any words or actions by police likely to elicit an incriminating response." },
        { question: "How does a suspect invoke the right to counsel?", answer: "The suspect must make a specific, unambiguous statement asserting their desire to have counsel present. Once invoked, all interrogation must cease until counsel is present." },
        { question: "What is the Double Jeopardy Clause?", answer: "The Fifth Amendment protects against being prosecuted twice for the same offense after acquittal, convicted twice for the same offense, or receiving multiple punishments for the same offense. (Blockburger test applies)." },
        { question: "What is the Exclusionary Rule?", answer: "Evidence obtained in violation of a defendant's Fourth, Fifth, or Sixth Amendment rights is generally inadmissible at trial. This includes the 'fruit of the poisonous tree' - evidence derived from the initial illegality." },
    ]
  },
  evidence: {
    subject: "Evidence",
    cards: [
        { question: "Define Relevance.", answer: "Evidence is relevant if: (a) it has any tendency to make a fact more or less probable than it would be without the evidence; and (b) the fact is of consequence in determining the action. (FRE 401)" },
        { question: "When is character evidence admissible in a criminal case?", answer: "The prosecution cannot introduce a defendant's bad character to prove propensity. However, the defendant may 'open the door' by offering evidence of their own good character or the victim's bad character for a relevant trait." },
        { question: "What is Hearsay?", answer: "An out-of-court statement offered to prove the truth of the matter asserted. It is generally inadmissible unless it falls under an exception or exclusion." },
        { question: "What is the 'Admissions by a Party-Opponent' exclusion?", answer: "A statement made by a party to the litigation is not hearsay if it is offered by an opposing party. (FRE 801(d)(2))" },
        { question: "What is the 'Excited Utterance' exception?", answer: "A statement relating to a startling event or condition, made while the declarant was under the stress of excitement that it caused. (FRE 803(2))" },
    ]
  },
  family: {
    subject: "Family Law",
    cards: [
        { question: "What are the requirements for a valid Premarital Agreement under the UPAA?", answer: "It must be in writing and signed. To prevent enforcement, a party must prove (i) involuntariness (fraud/duress), OR (ii) the agreement was unconscionable when executed AND they did not receive/waive fair disclosure of assets." },
        { question: "What are the elements of a Common-Law Marriage?", answer: "The parties must: (1) agree they are married, (2) cohabit as spouses, and (3) hold themselves out to the public as married." },
        { question: "What is the standard for Child Custody determinations?", answer: "The 'Best Interests of the Child' (BIOC) standard. Courts consider numerous factors, including the parents' wishes, the child's wishes (if mature enough), and the child's adjustment to home, school, and community." },
        { question: "What is the Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)?", answer: "Governs subject-matter jurisdiction for interstate custody disputes. Priority is given to the child's 'home state' (where the child has lived for 6 months prior to the proceeding)." },
    ]
  },
  partnerships: {
    subject: "Partnerships",
    cards: [
        { question: "How is a General Partnership formed?", answer: "An association of two or more persons to carry on a for-profit business as co-owners. No formal agreement or filing is required. Sharing of profits is prima facie evidence of a partnership." },
        { question: "What is the liability of a general partner?", answer: "Each partner is jointly and severally liable for all partnership obligations. A creditor must generally exhaust partnership assets before levying on a partner's personal assets." },
        { question: "What Fiduciary Duties do partners owe?", answer: "Partners owe the duty of loyalty (no self-dealing, competing with the partnership, or usurping opportunities) and the duty of care (no grossly negligent or reckless conduct)." },
        { question: "What is the difference between an LLP and a General Partnership?", answer: "In a Limited Liability Partnership (LLP), partners are not personally liable for the obligations of the partnership. An LLP is formed by filing a statement of qualification with the state." },
    ]
  },
  property: {
    subject: "Real Property",
    cards: [
        { question: "What is a Fee Simple Determinable?", answer: "An estate that automatically terminates upon the happening of a stated condition, and full ownership reverts to the grantor. Created with durational language like 'so long as,' 'until,' or 'while'." },
        { question: "What are the four unities of a Joint Tenancy?", answer: "Time, Title, Interest, and Possession. Joint tenants must acquire their interests at the same time, in the same instrument, with equal shares, and have an equal right to possess the whole property. It includes a right of survivorship." },
        { question: "What is an Easement by Implication (Prior Use)?", answer: "Arises when a landowner subdivides land and a prior use continues. Requires the use to be (1) continuous, (2) apparent or known, and (3) reasonably necessary for the dominant land's use and enjoyment." },
        { question: "What is Adverse Possession?", answer: "A method of acquiring title to real property by possessing it for a statutory period in a way that is: Continuous, Open and Notorious, Actual, and Hostile (without the owner's permission)." },
    ]
  },
  secured: {
    subject: "Secured Transactions",
    cards: [
        { question: "What is Attachment?", answer: "The process that makes a security interest enforceable against the debtor. Requires: (1) Value given by the secured party, (2) Debtor has rights in the collateral, and (3) an authenticated Security Agreement describing the collateral (or possession/control)." },
        { question: "What is Perfection?", answer: "The process that gives the secured party rights in the collateral superior to most third parties. Usually achieved by filing a financing statement, but can also be done by possession, control, or automatically in some cases." },
        { question: "What is a Purchase-Money Security Interest (PMSI)?", answer: "A special security interest that arises when a lender gives value to a debtor to enable the debtor to acquire rights in the collateral. A PMSI often has superpriority over other security interests." },
        { question: "Who is a Buyer in the Ordinary Course of Business (BIOC)?", answer: "A person who buys goods in good faith, without knowledge that the sale violates the rights of another, from a person in the business of selling goods of that kind. A BIOC takes free of a security interest created by their seller." },
    ]
  },
  torts: {
    subject: "Torts",
    cards: [
      { question: "What are the four elements of negligence?", answer: "1. Duty: A duty of reasonable care owed by the defendant to the plaintiff.\n2. Breach: The defendant breached that duty.\n3. Causation: The breach was the actual and proximate cause of the plaintiff's injury.\n4. Damages: The plaintiff suffered actual damages." },
      { question: "Define 'res ipsa loquitur'.", answer: "'The thing speaks for itself.' It's a doctrine that allows an inference of negligence when an accident occurs that wouldn't normally happen without negligence, the object causing the injury was in the defendant's exclusive control, and the plaintiff was not contributorily negligent." },
      { question: "What is the 'eggshell skull' rule?", answer: "A tort law doctrine holding that a defendant is liable for the full extent of a plaintiff's injuries, even if those injuries are unexpectedly severe due to the plaintiff's pre-existing vulnerability or condition. You take your victim as you find them." },
      { question: "What is Strict Liability for Abnormally Dangerous Activities?", answer: "A defendant engaged in an abnormally dangerous activity (e.g., blasting, using explosives) is strictly liable for any harm that results, even if they exercised utmost care." },
    ]
  },
  trusts: {
    subject: "Trusts",
    cards: [
        { question: "What are the requirements for a valid trust?", answer: "A valid trust requires (1) a Settlor with intent to create a trust, (2) a Trustee, (3) ascertainable Beneficiaries, (4) Trust Property (res), and (5) a valid legal purpose." },
        { question: "What is a Spendthrift Trust?", answer: "A trust that expressly restricts the beneficiary's right to transfer their interest. Creditors generally cannot reach the beneficiary's interest until it is paid out, with exceptions for child/spousal support, tax liens, and suppliers of necessities." },
        { question: "What is the Cy Pres Doctrine?", answer: "If a charitable trust's purpose becomes illegal, impracticable, or impossible, a court may modify the trust to seek an alternative charitable purpose that is as near as possible to the settlor's original intent." },
        { question: "What are the trustee's primary duties?", answer: "The duty of loyalty (no self-dealing), the duty of care (to act as a prudent investor), the duty to diversify investments, and the duty of impartiality towards all beneficiaries." },
    ]
  },
  wills: {
    subject: "Wills & Decedent’s Estates",
    cards: [
        { question: "What are the requirements for a valid attested will?", answer: "The will must be (1) in writing, (2) signed by the testator (or at their direction), and (3) signed by at least two witnesses who saw the testator sign or acknowledge the will." },
        { question: "What is a Holographic Will?", answer: "A will that is written in the testator's handwriting. In jurisdictions that recognize them, the material provisions must be in the testator's handwriting and it must be signed by the testator. Witnesses are not required." },
        { question: "What is the Anti-Lapse Statute?", answer: "Prevents a gift from failing (lapsing) when a beneficiary predeceases the testator. If the beneficiary is a specified relative of the testator and left issue (descendants), the gift passes to the issue instead of the residuary." },
        { question: "What is Ademption?", answer: "The common law doctrine that a specific bequest fails if the property is no longer in the testator's estate at death. Many states have modified this rule to allow the beneficiary to receive replacement property or the sale proceeds in some cases." },
    ]
  },
  conlaw: {
    subject: "Constitutional Law",
    cards: [
        { question: "What is the Dormant Commerce Clause?", answer: "A doctrine limiting states from passing laws that discriminate against or unduly burden interstate commerce. If a law is discriminatory, it's invalid unless it's necessary to achieve an important government purpose. If non-discriminatory, it's invalid if the burden on commerce outweighs the non-economic state benefits." },
        { question: "When does 'State Action' apply?", answer: "The Constitution generally protects against wrongful conduct by the government, not private parties. State action is found when a private person carries on activities that are traditionally and exclusively performed by the state (e.g., running elections) or when there is significant state involvement (entanglement)." },
        { question: "What are the levels of scrutiny for Equal Protection and Substantive Due Process?", answer: "1. Strict Scrutiny (Race, National Origin, Alienage, Fundamental Rights): Law must be necessary for a compelling government interest.\n2. Intermediate Scrutiny (Gender, Legitimacy): Law must be substantially related to an important government interest.\n3. Rational Basis (All others): Law must be rationally related to a legitimate government interest." },
        { question: "What is the Lemon Test for the Establishment Clause?", answer: "A law does not violate the Establishment Clause if: (1) it has a secular purpose, (2) its primary effect does not advance or inhibit religion, and (3) it does not produce excessive government entanglement with religion." },
    ]
  }
};

// --- Helper Icon Components ---
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
const ShuffleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2l4.3 8.2c.7 1.3 2.1 2.2 3.6 2.2H22"/><path d="m18 22-4-4 4-4"/></svg>
);

// --- Flashcard Component ---
const Flashcard = ({ card, isFlipped, onFlip }) => {
  return (
    <div className="w-full h-full perspective-1000 cursor-pointer" onClick={onFlip}>
      <div className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg flex items-center justify-center p-4 md:p-6 border border-gray-200">
          <p className="text-xl landscape:text-lg sm:text-2xl text-center text-gray-800">{card.question}</p>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-gray-100 rounded-xl shadow-lg p-4 md:p-6 border border-gray-200 rotate-y-180 overflow-y-auto">
          <p className="text-base landscape:text-sm sm:text-lg text-gray-700 whitespace-pre-line">{card.answer}</p>
        </div>
      </div>
    </div>
  );
};

// --- Helper function to get initial state from localStorage ---
const getInitialDeckKey = () => {
  try {
    const savedSelection = localStorage.getItem('barExamDeckSelection');
    if (savedSelection) {
      const { key, timestamp } = JSON.parse(savedSelection);
      const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
      
      // Check if the saved key is valid and not expired
      if (allDecks[key] && (Date.now() - timestamp < threeHours)) {
        return key;
      }
    }
  } catch (error) {
    console.error("Could not parse saved deck selection:", error);
  }
  return 'agency'; // Default to 'agency' if nothing is saved, it's expired, or invalid
};


// --- Main App Component ---
export default function App() {
  const [deckKey, setDeckKey] = useState(getInitialDeckKey);
  const [deck, setDeck] = useState(allDecks[deckKey]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = useMemo(() => deck.cards[currentIndex], [deck, currentIndex]);

  const changeDeck = (newDeckKey) => {
    setIsFlipped(false);
    setTimeout(() => {
      setDeckKey(newDeckKey);
      setDeck(allDecks[newDeckKey]);
      setCurrentIndex(0);

      // Save the new selection and timestamp to localStorage
      try {
        const selection = {
          key: newDeckKey,
          timestamp: Date.now()
        };
        localStorage.setItem('barExamDeckSelection', JSON.stringify(selection));
      } catch (error) {
        console.error("Could not save deck selection:", error);
      }
    }, 150);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % deck.cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + deck.cards.length) % deck.cards.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      const shuffledCards = [...deck.cards].sort(() => Math.random() - 0.5);
      setDeck(prevDeck => ({ ...prevDeck, cards: shuffledCards }));
      setCurrentIndex(0);
    }, 150);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="bg-gray-50 h-screen w-screen flex flex-col font-sans p-2 sm:p-4 landscape:py-2">
      <div className="w-full max-w-2xl mx-auto flex flex-col h-full">
        <header className="flex-shrink-0 text-center py-2 landscape:py-1">
          <p className="text-xl text-blue-600 font-semibold mt-1">{deck.subject}</p>
        </header>

        <div className="flex-shrink-0 mb-4 landscape:mb-2 w-full max-w-xs mx-auto">
          <label htmlFor="deck-select" className="block text-sm font-medium text-gray-700 mb-1 text-center">Select Subject:</label>
          <select
            id="deck-select"
            value={deckKey}
            onChange={(e) => changeDeck(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
          >
            {Object.keys(allDecks).map(key => (
              <option key={key} value={key}>{allDecks[key].subject}</option>
            ))}
          </select>
        </div>

        <main className="flex-grow relative min-h-0">
          {currentCard ? (
            <Flashcard card={currentCard} isFlipped={isFlipped} onFlip={handleFlip} />
          ) : (
            <div className="w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center p-6 border border-gray-200">
                <p className="text-xl text-gray-500">No cards in this deck.</p>
            </div>
          )}
        </main>

        <footer className="flex-shrink-0 py-2 landscape:py-1">
          <div className="flex items-center justify-center mb-2 landscape:mb-1">
            <p className="text-gray-600 font-medium">
              Card {deck.cards.length > 0 ? currentIndex + 1 : 0} of {deck.cards.length}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button onClick={handlePrev} className="flex items-center justify-center p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Previous card"><ChevronLeftIcon /></button>
            <button onClick={handleShuffle} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-semibold text-gray-700" aria-label="Shuffle deck"><ShuffleIcon /> Shuffle</button>
            <button onClick={handleNext} className="flex items-center justify-center p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" aria-label="Next card"><ChevronRightIcon /></button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// --- Custom CSS for 3D transform effects ---
const style = document.createElement('style');
style.innerHTML = `
  .perspective-1000 { perspective: 1000px; }
  .transform-style-3d { transform-style: preserve-3d; }
  .rotate-y-180 { transform: rotateY(180deg); }
  .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
`;
document.head.appendChild(style);

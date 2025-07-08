import React, { useState, useMemo, useLayoutEffect } from 'react';

// --- Custom Hook to get real viewport height ---
const useWindowHeight = () => {
  const [height, setHeight] = useState(window.innerHeight);

  useLayoutEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial height

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return height;
};


// --- Data for all flashcard decks ---
const allDecks = {
  agency: {
    subject: "Agency",
    cards: [
      { question: "Creating an Agency Relationship", answer: "Requires (1) Assent – principal and agent manifest assent; (2) Benefit – agent agrees to work for the principal’s benefit; and (3) Control – agent agrees to work subject to the principal’s control. No consideration is required." },
      { question: "What is Actual Authority?", answer: "Actual Express Authority is created by written or spoken words. Actual Implied Authority is when the agent takes necessary steps to achieve the principal’s objectives, including actions within accepted business custom." },
      { question: "What is Apparent Authority?", answer: "The principal creates apparent authority through words or conduct that cause a third party to reasonably believe the agent has authority. It exists until the principal notifies the third party." },
      { question: "What is Vicarious Liability (Respondeat Superior)?", answer: "An employer is liable for an employee's torts if: (1) the employer has the right to control the employee's acts, and (2) the tort was committed within the scope of employment. Distinguish between a minor 'detour' (liable) and a major 'frolic' (not liable)." },
      { question: "What is Ratification?", answer: "A principal can be bound by a contract entered into by an agent without authority if the principal later ratifies the transaction. Requires the principal to have knowledge of all material facts, accept the entire transaction, and have capacity." },
      { question: "What are an agent's duties to the principal?", answer: "An agent owes the principal fiduciary duties, including the duty of loyalty (acting solely for the principal's benefit), the duty of care (acting as a reasonable agent would), and the duty of obedience (following all lawful instructions)." },
      { question: "When can a principal be liable for an independent contractor's torts?", answer: "Generally, a principal is not liable for the torts of an independent contractor. Exceptions exist for (1) inherently dangerous activities, (2) non-delegable duties, and (3) when the principal is estopped from denying an agency relationship." },
      { question: "What is the difference between a disclosed, partially disclosed, and undisclosed principal?", answer: "Disclosed: Third party knows the agent is acting for a principal and knows the principal's identity. Partially Disclosed: Third party knows the agent is acting for a principal but does not know the principal's identity. Undisclosed: Third party does not know the agent is acting for a principal." },
      { question: "Who is liable on a contract with a partially disclosed or undisclosed principal?", answer: "Both the agent and the principal are liable on the contract. The third party can choose to hold either one liable." },
    ]
  },
  civpro: {
    subject: "Civil Procedure",
    cards: [
      { question: "What are the two requirements for Personal Jurisdiction?", answer: "1. The basis for exercising PJ over an out-of-state defendant must be authorized by a state long-arm statute.\n2. The exercise of jurisdiction must be permitted by the Due Process Clause (i.e., sufficient minimum contacts)." },
      { question: "What are the requirements for Diversity Jurisdiction?", answer: "A U.S. District Court has diversity jurisdiction if (1) there is complete diversity (no plaintiff shares citizenship with any defendant) and (2) the amount in controversy exceeds $75,000." },
      { question: "What is the rule for Removal Jurisdiction?", answer: "A defendant can remove a case from state to federal court if the case could have originally been brought in federal court. All defendants must consent. If removal is based on diversity, no defendant can be a citizen of the state where the action was filed." },
      { question: "What is the Erie Doctrine?", answer: "In a diversity case, a federal court will apply its own federal procedural law, but it must apply the substantive law of the state in which it sits. This includes state statutes of limitations and choice-of-law rules. If a federal rule is on point and valid, it will apply." },
      { question: "What is required for Claim Preclusion (Res Judicata)?", answer: "Claim preclusion prevents relitigation of a claim that has already been decided. It requires: (1) a valid, final judgment on the merits; (2) the same parties (or those in privity with them); and (3) the same claim (arising from the same transaction or occurrence)." },
      { question: "What is required for Issue Preclusion (Collateral Estoppel)?", answer: "Issue preclusion prevents relitigation of a specific issue of fact or law. It requires: (1) the issue was actually litigated and determined in the prior case; (2) the issue was essential to the judgment; (3) the prior case ended in a valid, final judgment on the merits; and (4) the party against whom preclusion is asserted had a full and fair opportunity to litigate the issue." },
      { question: "What is the standard for a Motion for Summary Judgment (FRCP 56)?", answer: "The court shall grant summary judgment if the movant shows that there is no genuine dispute as to any material fact and the movant is entitled to judgment as a matter of law. The evidence is viewed in the light most favorable to the non-moving party." },
      { question: "What is the work product doctrine?", answer: "Protects materials prepared in anticipation of litigation from discovery by opposing counsel. It can be overcome if the party seeking discovery shows a substantial need for the materials and an inability to obtain the equivalent without undue hardship. An attorney's mental impressions are almost always absolutely protected." },
      { question: "What are the rules for joinder of parties under FRCP 20?", answer: "Permissive joinder allows multiple plaintiffs to join in one action if they assert any right to relief jointly, severally, or arising out of the same transaction or occurrence, and if any question of law or fact common to all plaintiffs will arise in the action. The same rules apply to joining multiple defendants." },
      { question: "What is impleader (Third-Party Practice) under FRCP 14?", answer: "A defending party may, as a third-party plaintiff, serve a summons and complaint on a nonparty who is or may be liable to it for all or part of the claim against it. This is often used for indemnity or contribution claims." },
    ]
  },
  conflicts: {
    subject: "Conflicts of Laws",
    cards: [
        { question: "What is the Constitutional limitation on choice of law?", answer: "Under the Due Process Clause, a forum state may apply its own law only if it has a significant contact or aggregation of contacts such that the choice of its law is neither arbitrary nor fundamentally unfair." },
        { question: "What is the Full Faith & Credit Clause's role with judgments?", answer: "State courts are required to give full faith and credit to the final judgments of other states, treating them as they would be treated by the courts of the original state, provided the original court had jurisdiction." },
        { question: "What is the Vested Rights Approach (First Restatement)?", answer: "The law that controls is the law of the jurisdiction where the parties’ rights vested. For a tort, this is the place of the injury. For a contract, it is the place where the contract was made." },
        { question: "What is the Most Significant Relationship Approach (Second Restatement)?", answer: "The law of the state with the most significant relationship to the issue is applied, considering connecting facts (contacts) and policy principles (e.g., interests of the states, protecting justified expectations)." },
        { question: "How are Torts cases handled under the Second Restatement?", answer: "The law of the state with the most significant relationship is applied. Key contacts include the place of injury, the place of conduct causing injury, the domicile of the parties, and the place where the relationship between the parties is centered." },
        { question: "How are Contracts cases with a choice-of-law clause handled?", answer: "The parties' choice of law will be upheld if the contract has a substantial relationship to the chosen state or there is some other reasonable basis for the choice, and the chosen law is not contrary to a fundamental policy of the state with the most significant relationship to the issue." },
    ]
  },
  contracts: {
    subject: "Contracts & Sales",
    cards: [
      { question: "What are the essential terms under Common Law vs. UCC?", answer: "Common Law: All essential terms must be covered (parties, subject, price, quantity).\nUCC: Only quantity is essential. The UCC 'fills the gap' for other missing terms if the parties intended to contract." },
      { question: "What is the UCC Firm Offer Rule?", answer: "An offer by a merchant to buy or sell goods in a signed writing which gives assurance it will be held open is not revocable for lack of consideration for the time stated (or a reasonable time, max 3 months)." },
      { question: "What is an Anticipatory Repudiation?", answer: "An anticipatory repudiation occurs when a party, prior to the date of performance, makes an unequivocal and definite statement that they will not perform. The non-repudiating party may (1) treat the repudiation as an immediate breach and sue for damages, (2) suspend their own performance and wait to sue, (3) treat the repudiation as an offer to rescind, or (4) ignore the repudiation and urge performance." },
      { question: "What is the Parol Evidence Rule?", answer: "The Parol Evidence Rule prevents a party to a **fully integrated written contract** from introducing evidence of prior or contemporaneous agreements (oral or written) that contradict, modify, or vary the contractual terms. The rule does not apply to subsequent modifications, evidence to clarify ambiguity, or evidence to show a defense to formation (like fraud or duress)." },
      { question: "What is the difference between an express condition and a constructive condition?", answer: "* An **Express Condition** is a condition explicitly stated in the contract (e.g., using words like 'if,' 'on the condition that,' 'provided that'). Strict compliance with express conditions is required.\n* A **Constructive Condition** (or implied condition) is one that is implied by law. The most common is the constructive condition of exchange, where one party's performance is conditioned on the other party's performance. Substantial performance is sufficient to satisfy a constructive condition." },
      { question: "What is the main rule of the Statute of Frauds?", answer: "The Statute of Frauds requires certain types of contracts to be in writing and signed by the party to be charged to be enforceable. The main categories are contracts for the **M**arriage, contracts that cannot be performed within one **Y**ear, contracts for the sale of **L**and, contracts of an **E**xecutor to answer for a decedent's debt, contracts of **G**uarantee or suretyship, and contracts for the **S**ale of goods for $500 or more (UCC). (Mnemonic: MY LEGS)." },
      { question: "What are expectation damages?", answer: "The standard measure of contract damages. They are intended to put the non-breaching party in the same position they would have been in had the contract been fully performed." },
      { question: "What is the difference between assignment and delegation?", answer: "An **assignment** is the transfer of rights under a contract to a third party. A **delegation** is the transfer of duties under a contract to a third party. While most rights are assignable and duties delegable, the original party (delegator) remains liable for performance." },
      { question: "What is the defense of impracticability?", answer: "Performance is excused if it has become impracticable through no fault of the party seeking to be excused, due to an unforeseen event the non-occurrence of which was a basic assumption of the contract. The event must make performance extremely and unreasonably difficult." },
    ]
  },
  corps: {
    subject: "Corporations",
    cards: [
        { question: "What is Promoter Liability?", answer: "A promoter is personally liable on pre-incorporation contracts. The promoter is only released from liability by a novation (an agreement between the third party, the corporation, and the promoter to substitute the corporation for the promoter)." },
        { question: "What is Piercing the Corporate Veil?", answer: "Courts may disregard the corporate entity and hold shareholders personally liable if they abuse the corporate form, such as by undercapitalization, commingling assets, or defrauding creditors. It requires showing that the corporation is an 'alter ego' of the shareholder and that failure to pierce would result in injustice." },
        { question: "What is the Business Judgment Rule (BJR)?", answer: "The Business Judgment Rule is a rebuttable presumption that a director's decision was made on an informed basis, in good faith, and in the honest belief that the action was in the best interests of the company. It protects directors from liability for poor business decisions." },
        { question: "What are the primary fiduciary duties of a director?", answer: "1. **Duty of Care:** A director must act with the care that a person in a like position would reasonably believe appropriate under similar circumstances.\n2. **Duty of Loyalty:** A director must act in good faith and in a manner the director reasonably believes to be in the best interests of the corporation. This prohibits self-dealing, competing with the corporation, and usurping corporate opportunities." },
        { question: "What is a derivative suit?", answer: "A derivative suit is a lawsuit brought by a shareholder on behalf of the corporation against a third party (often the corporation's own directors or officers). The shareholder must first make a demand on the board to bring the suit, unless such a demand would be futile. Any recovery goes to the corporation, not the shareholder." },
        { question: "What is a quorum for a board of directors meeting?", answer: "A quorum is the minimum number of directors who must be present for the board to transact business. Unless the bylaws state otherwise, a quorum is a majority of the authorized number of directors. A vote can only pass with the approval of a majority of the directors present at the meeting." },
        { question: "What is Rule 10b-5?", answer: "A federal law that prohibits fraud or misrepresentation in connection with the purchase or sale of any security. A private plaintiff must show: (1) a fraudulent act (misstatement or omission), (2) in connection with the purchase or sale of a security, (3) reliance on the fraudulent act, and (4) damages." },
    ]
  },
  crimlaw: {
    subject: "Criminal Law",
    cards: [
        { question: "What are the four types of Mens Rea?", answer: "1. Specific Intent: The intent to commit the act and cause the specific result.\n2. Malice: Reckless disregard of a high degree of harm.\n3. General Intent: The intent to perform an unlawful act.\n4. Strict Liability: No mental state required; the act itself is sufficient." },
        { question: "What is Accomplice Liability?", answer: "A person is an accomplice if they intentionally assist with the crime and act with the purpose of promoting or facilitating its commission. Mere knowledge is not enough. An accomplice is liable for the crime itself and all other foreseeable crimes committed." },
        { question: "What are the elements of Conspiracy?", answer: "1. An agreement between two or more people;\n2. an intent to enter into the agreement and to achieve the objective of the agreement; and\n3. an overt act in furtherance of the conspiracy (in most jurisdictions)." },
        { question: "What is Felony Murder?", answer: "A killing that occurs during the commission or attempted commission of an inherently dangerous felony (usually Burglary, Arson, Rape, Robbery, Kidnapping - BARRK). Malice is implied from the intent to commit the underlying felony." },
        { question: "What is the difference between larceny, embezzlement, and false pretenses?", answer: "All are theft crimes, but they differ in how the defendant acquires the property.\n* **Larceny:** The trespassory taking and carrying away of the personal property of another with the intent to permanently deprive. The defendant never had lawful possession.\n* **Embezzlement:** The fraudulent conversion of the property of another by a person in lawful possession of that property.\n* **False Pretenses:** Obtaining title to the property of another by means of a knowing false representation of a material fact with the intent to defraud." },
        { question: "What are the elements of attempt?", answer: "An attempt requires (1) a **specific intent** to commit the target crime, and (2) a **substantial step** in furtherance of that crime that goes beyond mere preparation." },
        { question: "What is the M'Naghten test for insanity?", answer: "A defendant is entitled to an acquittal if, because of a mental disease or defect, they did not know the nature and quality of the act they were doing, or if they did know it, they did not know that what they were doing was wrong." },
        { question: "What is the defense of duress?", answer: "The defendant reasonably believed that another person would imminently inflict death or great bodily harm upon them or a family member if they did not commit the crime. Duress is not a defense to intentional homicide." },
    ]
  },
  crimpro: {
    subject: "Criminal Procedure",
    cards: [
        { question: "When are Miranda rights required?", answer: "Miranda warnings are required when a suspect is subjected to a **custodial interrogation**. 'Custody' is an objective test: would a reasonable person feel they were not free to terminate the interview and leave? 'Interrogation' includes any words or actions by police that they should know are reasonably likely to elicit an incriminating response." },
        { question: "How does a suspect invoke the right to counsel?", answer: "The suspect must make a specific, unambiguous statement asserting their desire to have counsel present. Once invoked, all interrogation must cease until counsel is present." },
        { question: "What is the Fourth Amendment exclusionary rule?", answer: "The exclusionary rule is a judicially created remedy that prohibits the introduction at a criminal trial of evidence obtained in violation of a defendant's Fourth, Fifth, or Sixth Amendment rights. The 'fruit of the poisonous tree' doctrine also excludes evidence derived from the initial illegality." },
        { question: "What is the search incident to a lawful arrest exception?", answer: "Upon a lawful arrest, the police may conduct a contemporaneous search of the person arrested and the areas within their immediate control (their 'wingspan') without a warrant." },
        { question: "What is the automobile exception to the warrant requirement?", answer: "If the police have probable cause to believe a vehicle contains contraband or evidence of a crime, they may search the vehicle without a warrant, including any containers within the vehicle that might reasonably contain the item for which they have probable cause to search." },
        { question: "What is the Sixth Amendment right to counsel?", answer: "The Sixth Amendment provides a right to counsel in all criminal prosecutions. It attaches once formal adversarial judicial proceedings have been initiated (e.g., formal charge, indictment). It is offense-specific, meaning it only applies to the specific crime for which the defendant has been charged." },
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
        { question: "What is the Best Evidence Rule?", answer: "The Best Evidence Rule (or Original Document Rule) requires that to prove the contents of a writing, recording, or photograph, the **original writing, recording, or photograph must be produced**. The rule applies only when the contents of the document are at issue. Secondary evidence (like copies or testimony) is admissible only if the original is lost, destroyed, or otherwise unavailable through no fault of the proponent." },
        { question: "What is the difference between the Present Sense Impression and Excited Utterance exceptions to hearsay?", answer: "* **Present Sense Impression:** A statement **describing or explaining** an event or condition, made **while or immediately after** the declarant perceived it. The timing is critical.\n* **Excited Utterance:** A statement **relating to a startling event or condition**, made while the declarant was **under the stress of excitement** that it caused. The key is the declarant's state of mind (still under the stress of the event), which can last longer than the window for a present sense impression." },
        { question: "For what purposes can a defendant's prior bad acts or crimes be admitted?", answer: "Under FRE 404(b), evidence of a defendant's other crimes, wrongs, or acts is not admissible to prove character or propensity. However, it may be admissible for a non-propensity purpose, such as proving **M**otive, **I**ntent, absence of **M**istake, **I**dentity (modus operandi), or **C**ommon plan or scheme. (Mnemonic: MIMIC)." },
        { question: "What is the hearsay exception for Statements Made for Medical Diagnosis or Treatment?", answer: "A statement is not excluded as hearsay if it is made for—and is reasonably pertinent to—medical diagnosis or treatment and describes medical history, past or present symptoms, or their inception or general cause. The statement can be made to any medical professional and need not be made by the patient." },
        { question: "What is the attorney-client privilege?", answer: "Protects confidential communications between an attorney and client made for the purpose of seeking legal advice. The privilege belongs to the client and must be claimed by the client; the attorney's duty of confidentiality is broader and applies regardless of whether the privilege is invoked." },
    ]
  },
  family: {
    subject: "Family Law",
    cards: [
        { question: "What are the requirements for a valid common-law marriage?", answer: "To establish a common-law marriage, the parties must (1) have the capacity to marry, (2) presently agree they are married, (3) cohabit, and (4) hold themselves out to the public as married." },
        { question: "What is the standard for determining child custody?", answer: "The standard is the **Best Interests of the Child**. Courts consider many factors, including the wishes of the parents, the wishes of the child (if of sufficient age and maturity), the child's adjustment to home, school, and community, and the mental and physical health of all individuals involved." },
        { question: "What are the requirements for a valid Premarital Agreement under the UPAA?", answer: "It must be in writing and signed. To prevent enforcement, a party must prove (i) involuntariness (fraud/duress), OR (ii) the agreement was unconscionable when executed AND they did not receive/waive fair disclosure of assets." },
        { question: "What is the Uniform Child Custody Jurisdiction and Enforcement Act (UCCJEA)?", answer: "Governs subject-matter jurisdiction for interstate custody disputes. Priority is given to the child's 'home state' (where the child has lived for 6 months prior to the proceeding)." },
        { question: "What is the difference between marital and separate property?", answer: "Marital property is generally all property acquired during the marriage, regardless of whose name is on the title. Separate property is property acquired before the marriage, or during the marriage by gift, bequest, or devise. Most states use equitable distribution to divide marital property." },
    ]
  },
  property: {
    subject: "Real Property",
    cards: [
        { question: "What is a Fee Simple Determinable?", answer: "An estate that automatically terminates upon the happening of a stated condition, and full ownership reverts to the grantor. Created with durational language like 'so long as,' 'until,' or 'while'." },
        { question: "What are the four unities of a Joint Tenancy?", answer: "Time, Title, Interest, and Possession. Joint tenants must acquire their interests at the same time, in the same instrument, with equal shares, and have an equal right to possess the whole property. It includes a right of survivorship." },
        { question: "What is an Easement by Implication (Prior Use)?", answer: "Arises when a landowner subdivides land and a prior use continues. Requires the use to be (1) continuous, (2) apparent or known, and (3) reasonably necessary for the dominant land's use and enjoyment." },
        { question: "What are the elements of Adverse Possession?", answer: "To acquire title through adverse possession, the possession must be:\n1. **Continuous** for the statutory period.\n2. **Open and Notorious** (sufficient to put the true owner on notice).\n3. **Actual** and exclusive.\n4. **Hostile** (without the owner's permission)." },
        { question: "What are the six covenants of title in a general warranty deed?", answer: "* **Present Covenants** (breached, if at all, at the time of conveyance):\n  1. **Covenant of Seisin:** Grantor warrants they own the estate they purport to convey.\n  2. **Covenant of Right to Convey:** Grantor warrants they have the power to make the conveyance.\n  3. **Covenant Against Encumbrances:** Grantor warrants there are no undisclosed physical or title encumbrances on the property.\n* **Future Covenants** (breached, if at all, at some point in the future upon interference by a third party):\n  4. **Covenant of Quiet Enjoyment:** Grantor warrants that the grantee will not be disturbed in possession by a third party's lawful claim of title.\n  5. **Covenant of Warranty:** Grantor agrees to defend against reasonable claims of title by a third party.\n  6. **Covenant of Further Assurances:** Grantor promises to perform whatever acts are reasonably necessary to perfect the title conveyed." },
        { question: "How is a real covenant different from an equitable servitude?", answer: "Both are promises concerning the use of land. The primary difference is the remedy sought for a breach.\n* For a **Real Covenant** to run with the land, you need: a writing, intent for the covenant to run, touch and concern the land, and both horizontal and vertical privity. The remedy for breach is **money damages**.\n* For an **Equitable Servitude** to run with the land, you need: a writing, intent, touch and concern, and notice (for the burdened party). Privity is not required. The remedy for breach is an **injunction**." },
        { question: "What are the three types of recording acts?", answer: "1. **Notice:** A subsequent bona fide purchaser (BFP) for value without notice of a prior interest prevails over the prior interest.\n2. **Race-Notice:** A subsequent BFP for value without notice of a prior interest prevails, but only if they also record first.\n3. **Race:** The first to record prevails, regardless of notice." },
        { question: "What is the implied warranty of habitability?", answer: "A warranty implied in residential leases that the landlord will maintain the property in a condition fit for human habitation. If breached, the tenant may be able to terminate the lease, make repairs and deduct the cost from rent, or seek damages." },
    ]
  },
  secured: {
    subject: "Secured Transactions",
    cards: [
        { question: "What is Attachment?", answer: "The process that makes a security interest enforceable against the debtor. Requires: (1) Value given by the secured party, (2) Debtor has rights in the collateral, and (3) an authenticated Security Agreement describing the collateral (or possession/control)." },
        { question: "What is Perfection?", answer: "The process that gives the secured party rights in the collateral superior to most third parties. Usually achieved by filing a financing statement, but can also be done by possession, control, or automatically in some cases." },
        { question: "What is a Purchase-Money Security Interest (PMSI)?", answer: "A special security interest that arises when a lender gives value to a debtor to enable the debtor to acquire rights in the collateral. A PMSI often has superpriority over other security interests." },
        { question: "Who is a Buyer in the Ordinary Course of Business (BIOC)?", answer: "A person who buys goods in good faith, without knowledge that the sale violates the rights of another, from a person in the business of selling goods of that kind. A BIOC takes free of a security interest created by their seller." },
        { question: "What is the priority rule for a PMSI in inventory?", answer: "A PMSI in inventory has priority over a conflicting security interest in the same inventory if (1) the PMSI is perfected when the debtor receives possession of the inventory, and (2) the PMSI-secured party sends an authenticated notification to the holder of the conflicting security interest before the debtor receives possession." },
    ]
  },
  torts: {
    subject: "Torts",
    cards: [
      { question: "What are the four elements of negligence?", answer: "1. Duty: A duty of reasonable care owed by the defendant to the plaintiff.\n2. Breach: The defendant breached that duty.\n3. Causation: The breach was the actual and proximate cause of the plaintiff's injury.\n4. Damages: The plaintiff suffered actual damages." },
      { question: "What are the four types of Invasion of Privacy?", answer: "1. **Intrusion Upon Seclusion:** An act of prying or intruding into a private place or on the private affairs of another in a manner that is highly offensive to a reasonable person.\n2. **Appropriation of Name or Likeness:** The unauthorized use of the plaintiff's name or likeness for the defendant's commercial advantage.\n3. **False Light:** The widespread publication of a falsehood about a person that would be highly offensive to a reasonable person.\n4. **Public Disclosure of Private Facts:** The widespread publication of private information about the plaintiff that would be highly offensive to a reasonable person and is not of legitimate public concern." },
      { question: "What are the three types of strict products liability?", answer: "1. **Manufacturing Defect:** The product departs from its intended design, making it more dangerous than consumers would expect. The test is whether the product conforms to the defendant's own specifications.\n2. **Design Defect:** All products of a line are dangerous because of a flawed design. The plaintiff must show that a less dangerous, economically feasible alternative design was available (the risk-utility test).\n3. **Failure to Warn (Inadequate Warning):** The product has a non-obvious risk that cannot be eliminated through redesign, and the manufacturer fails to provide an adequate warning of that risk." },
      { question: "What is Negligent Infliction of Emotional Distress (NIED)?", answer: "A plaintiff can recover for NIED in one of two ways:\n1. **Zone of Danger:** The plaintiff was within the zone of physical danger from the defendant's negligence and suffered physical symptoms from the resulting emotional distress.\n2. **Bystander Recovery:** The plaintiff was closely related to a person injured by the defendant, was present at the scene of the injury, and personally observed or perceived the injury." },
      { question: "What is the attractive nuisance doctrine?", answer: "A landowner may be liable for injuries to trespassing children if (1) there is a dangerous artificial condition the owner knows or should know of, (2) the owner knows children are likely to trespass, (3) the child, because of their age, cannot appreciate the risk, and (4) the risk of harm outweighs the utility of the condition." },
    ]
  },
  trusts: {
    subject: "Trusts",
    cards: [
        { question: "What are the essential elements of a valid private trust?", answer: "A valid trust requires (1) a **settlor** with capacity, (2) a clear **intent** to create a trust relationship, (3) a **trustee**, (4) **ascertainable beneficiaries**, and (5) **trust property** (res). The trust must also have a valid (legal) purpose." },
        { question: "What is a spendthrift trust?", answer: "A spendthrift trust is one that includes a provision that prevents the beneficiary from voluntarily or involuntarily transferring their interest in the trust. Creditors are generally unable to reach the beneficiary's interest, with exceptions for claims for child support, alimony, and claims by the government." },
        { question: "What is the Claflin doctrine?", answer: "A trust cannot be terminated, even if all beneficiaries consent, if doing so would be contrary to a material purpose of the settlor. For example, if the trust has a spendthrift provision or is intended to provide support for the beneficiary's lifetime." },
        { question: "What are the primary duties of a trustee?", answer: "A trustee owes fiduciary duties of loyalty (no self-dealing), care (to act as a prudent investor), and impartiality (to treat all beneficiaries fairly). They also have a duty to account and a duty not to commingle trust assets with their own." },
    ]
  },
  wills: {
    subject: "Wills & Decedent’s Estates",
    cards: [
        { question: "What are the requirements for a validly executed attested will?", answer: "A valid will must be (1) in writing, (2) signed by the testator (or by someone at the testator's direction and in their presence), and (3) signed by at least two witnesses, who signed in the testator's presence." },
        { question: "What is an interested witness?", answer: "An interested witness is a witness to a will who is also a beneficiary. At common law, such a will was void. Under the modern majority rule, the will is still valid, but the gift to the interested witness is purged to the extent it exceeds what the witness would have received in intestacy." },
        { question: "What is a Holographic Will?", answer: "A will that is written in the testator's handwriting. In jurisdictions that recognize them, the material provisions must be in the testator's handwriting and it must be signed by the testator. Witnesses are not required." },
        { question: "What is the Anti-Lapse Statute?", answer: "Prevents a gift from failing (lapsing) when a beneficiary predeceases the testator. If the beneficiary is a specified relative of the testator and left issue (descendants), the gift passes to the issue instead of the residuary." },
        { question: "What is the doctrine of ademption?", answer: "If a specific gift in a will is no longer in the testator's estate at the time of death, the gift is adeemed (it fails). Most jurisdictions have created exceptions to avoid ademption, such as if the property was sold but there are outstanding proceeds." },
        { question: "What is a pretermitted child?", answer: "A child born or adopted after the execution of a will who is not mentioned in the will. Most states have statutes that allow a pretermitted child to take an intestate share, on the theory that the omission was accidental." },
    ]
  },
  conlaw: {
    subject: "Constitutional Law",
    cards: [
        { question: "What is the difference between Procedural Due Process and Substantive Due Process?", answer: "* **Procedural Due Process** requires the government to provide **notice and an opportunity to be heard** before depriving a person of life, liberty, or property. The amount of process due is determined by balancing: (1) the importance of the individual's interest, (2) the risk of an erroneous deprivation through the procedures used, and (3) the government's interest in efficiency.\n* **Substantive Due Process** limits the **substance** of what a government can regulate. It asks whether the government has an adequate reason for the deprivation. If a law limits a **fundamental right** (e.g., travel, voting, privacy), it is subject to **strict scrutiny**. If it does not, it is subject to **rational basis** review." },
        { question: "What is the Dormant Commerce Clause?", answer: "The Dormant Commerce Clause is a constitutional principle that limits a state's ability to pass laws that unduly burden interstate commerce. If a state law discriminates against out-of-state commerce, it is presumptively invalid unless the state can show it is necessary to achieve an important, non-economic state interest. If the law is non-discriminatory but still burdens interstate commerce, the court will balance the law's benefits against the burden on commerce." },
        { question: "What are the three levels of scrutiny for Equal Protection claims?", answer: "1. **Strict Scrutiny:** Applies to classifications based on race, alienage, and national origin. The law must be **necessary** to achieve a **compelling** government interest.\n2. **Intermediate Scrutiny:** Applies to classifications based on gender and non-marital children. The law must be **substantially related** to an **important** government interest.\n3. **Rational Basis:** Applies to all other classifications (e.g., age, wealth, disability). The law must be **rationally related** to a **legitimate** government interest." },
        { question: "What is required for a law to be a valid time, place, and manner restriction on speech in a public forum?", answer: "The restriction must be (1) content-neutral, (2) narrowly tailored to serve a significant government interest, and (3) leave open ample alternative channels for communication." },
        { question: "What is the Takings Clause of the Fifth Amendment?", answer: "The government may not take private property for public use without just compensation. A taking can be a physical occupation or a regulation that leaves no economically viable use of the property." },
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
  const windowHeight = useWindowHeight();
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
    <div className="bg-gray-50 w-screen flex flex-col font-sans" style={{ height: windowHeight }}>
      <div className="w-full max-w-2xl mx-auto flex flex-col h-full p-2 sm:p-4">
        <header className="flex-shrink-0 text-center py-2 landscape:py-1">
          {/* The subject title has been removed from here */}
        </header>

        <div className="flex-shrink-0 mb-4 landscape:mb-2 w-full max-w-xs mx-auto">
          {/* The label has been removed from here */}
          <select
            id="deck-select"
            value={deckKey}
            onChange={(e) => changeDeck(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
            aria-label="Select Subject"
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

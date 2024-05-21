import {
  Cell,
  Slice,
  Address,
  Builder,
  beginCell,
  ComputeError,
  TupleItem,
  TupleReader,
  Dictionary,
  contractAddress,
  ContractProvider,
  Sender,
  Contract,
  ContractABI,
  ABIType,
  ABIGetter,
  ABIReceiver,
  TupleBuilder,
  DictionaryValue,
} from "@ton/core";

export type StateInit = {
  $$type: "StateInit";
  code: Cell;
  data: Cell;
};

export function storeStateInit(src: StateInit) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeRef(src.code);
    b_0.storeRef(src.data);
  };
}

export function loadStateInit(slice: Slice) {
  let sc_0 = slice;
  let _code = sc_0.loadRef();
  let _data = sc_0.loadRef();
  return { $$type: "StateInit" as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
  let _code = source.readCell();
  let _data = source.readCell();
  return { $$type: "StateInit" as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
  let builder = new TupleBuilder();
  builder.writeCell(source.code);
  builder.writeCell(source.data);
  return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
    },
    parse: (src) => {
      return loadStateInit(src.loadRef().beginParse());
    },
  };
}

export type Context = {
  $$type: "Context";
  bounced: boolean;
  sender: Address;
  value: bigint;
  raw: Cell;
};

export function storeContext(src: Context) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.bounced);
    b_0.storeAddress(src.sender);
    b_0.storeInt(src.value, 257);
    b_0.storeRef(src.raw);
  };
}

export function loadContext(slice: Slice) {
  let sc_0 = slice;
  let _bounced = sc_0.loadBit();
  let _sender = sc_0.loadAddress();
  let _value = sc_0.loadIntBig(257);
  let _raw = sc_0.loadRef();
  return {
    $$type: "Context" as const,
    bounced: _bounced,
    sender: _sender,
    value: _value,
    raw: _raw,
  };
}

function loadTupleContext(source: TupleReader) {
  let _bounced = source.readBoolean();
  let _sender = source.readAddress();
  let _value = source.readBigNumber();
  let _raw = source.readCell();
  return {
    $$type: "Context" as const,
    bounced: _bounced,
    sender: _sender,
    value: _value,
    raw: _raw,
  };
}

function storeTupleContext(source: Context) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.bounced);
  builder.writeAddress(source.sender);
  builder.writeNumber(source.value);
  builder.writeSlice(source.raw);
  return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeContext(src)).endCell());
    },
    parse: (src) => {
      return loadContext(src.loadRef().beginParse());
    },
  };
}

export type SendParameters = {
  $$type: "SendParameters";
  bounce: boolean;
  to: Address;
  value: bigint;
  mode: bigint;
  body: Cell | null;
  code: Cell | null;
  data: Cell | null;
};

export function storeSendParameters(src: SendParameters) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.bounce);
    b_0.storeAddress(src.to);
    b_0.storeInt(src.value, 257);
    b_0.storeInt(src.mode, 257);
    if (src.body !== null && src.body !== undefined) {
      b_0.storeBit(true).storeRef(src.body);
    } else {
      b_0.storeBit(false);
    }
    if (src.code !== null && src.code !== undefined) {
      b_0.storeBit(true).storeRef(src.code);
    } else {
      b_0.storeBit(false);
    }
    if (src.data !== null && src.data !== undefined) {
      b_0.storeBit(true).storeRef(src.data);
    } else {
      b_0.storeBit(false);
    }
  };
}

export function loadSendParameters(slice: Slice) {
  let sc_0 = slice;
  let _bounce = sc_0.loadBit();
  let _to = sc_0.loadAddress();
  let _value = sc_0.loadIntBig(257);
  let _mode = sc_0.loadIntBig(257);
  let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
  return {
    $$type: "SendParameters" as const,
    bounce: _bounce,
    to: _to,
    value: _value,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data,
  };
}

function loadTupleSendParameters(source: TupleReader) {
  let _bounce = source.readBoolean();
  let _to = source.readAddress();
  let _value = source.readBigNumber();
  let _mode = source.readBigNumber();
  let _body = source.readCellOpt();
  let _code = source.readCellOpt();
  let _data = source.readCellOpt();
  return {
    $$type: "SendParameters" as const,
    bounce: _bounce,
    to: _to,
    value: _value,
    mode: _mode,
    body: _body,
    code: _code,
    data: _data,
  };
}

function storeTupleSendParameters(source: SendParameters) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.bounce);
  builder.writeAddress(source.to);
  builder.writeNumber(source.value);
  builder.writeNumber(source.mode);
  builder.writeCell(source.body);
  builder.writeCell(source.code);
  builder.writeCell(source.data);
  return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
    },
    parse: (src) => {
      return loadSendParameters(src.loadRef().beginParse());
    },
  };
}

export type EventMintRecord = {
  $$type: "EventMintRecord";
  minter: Address;
  item_id: bigint;
  generate_number: bigint;
};

export function storeEventMintRecord(src: EventMintRecord) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(698436299, 32);
    b_0.storeAddress(src.minter);
    b_0.storeInt(src.item_id, 257);
    b_0.storeInt(src.generate_number, 257);
  };
}

export function loadEventMintRecord(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 698436299) {
    throw Error("Invalid prefix");
  }
  let _minter = sc_0.loadAddress();
  let _item_id = sc_0.loadIntBig(257);
  let _generate_number = sc_0.loadIntBig(257);
  return {
    $$type: "EventMintRecord" as const,
    minter: _minter,
    item_id: _item_id,
    generate_number: _generate_number,
  };
}

function loadTupleEventMintRecord(source: TupleReader) {
  let _minter = source.readAddress();
  let _item_id = source.readBigNumber();
  let _generate_number = source.readBigNumber();
  return {
    $$type: "EventMintRecord" as const,
    minter: _minter,
    item_id: _item_id,
    generate_number: _generate_number,
  };
}

function storeTupleEventMintRecord(source: EventMintRecord) {
  let builder = new TupleBuilder();
  builder.writeAddress(source.minter);
  builder.writeNumber(source.item_id);
  builder.writeNumber(source.generate_number);
  return builder.build();
}

function dictValueParserEventMintRecord(): DictionaryValue<EventMintRecord> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeEventMintRecord(src)).endCell());
    },
    parse: (src) => {
      return loadEventMintRecord(src.loadRef().beginParse());
    },
  };
}

export type Referral = {
  $$type: "Referral";
  referred_by: Address;
};

export function storeReferral(src: Referral) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2611848347, 32);
    b_0.storeAddress(src.referred_by);
  };
}

export function loadReferral(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2611848347) {
    throw Error("Invalid prefix");
  }
  let _referred_by = sc_0.loadAddress();
  return { $$type: "Referral" as const, referred_by: _referred_by };
}

function loadTupleReferral(source: TupleReader) {
  let _referred_by = source.readAddress();
  return { $$type: "Referral" as const, referred_by: _referred_by };
}

function storeTupleReferral(source: Referral) {
  let builder = new TupleBuilder();
  builder.writeAddress(source.referred_by);
  return builder.build();
}

function dictValueParserReferral(): DictionaryValue<Referral> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeReferral(src)).endCell());
    },
    parse: (src) => {
      return loadReferral(src.loadRef().beginParse());
    },
  };
}

export type ReferralWithTon = {
  $$type: "ReferralWithTon";
  referred_by: Address;
};

export function storeReferralWithTon(src: ReferralWithTon) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(893642077, 32);
    b_0.storeAddress(src.referred_by);
  };
}

export function loadReferralWithTon(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 893642077) {
    throw Error("Invalid prefix");
  }
  let _referred_by = sc_0.loadAddress();
  return { $$type: "ReferralWithTon" as const, referred_by: _referred_by };
}

function loadTupleReferralWithTon(source: TupleReader) {
  let _referred_by = source.readAddress();
  return { $$type: "ReferralWithTon" as const, referred_by: _referred_by };
}

function storeTupleReferralWithTon(source: ReferralWithTon) {
  let builder = new TupleBuilder();
  builder.writeAddress(source.referred_by);
  return builder.build();
}

function dictValueParserReferralWithTon(): DictionaryValue<ReferralWithTon> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeReferralWithTon(src)).endCell());
    },
    parse: (src) => {
      return loadReferralWithTon(src.loadRef().beginParse());
    },
  };
}

export type EventBoxOpenAllowed = {
  $$type: "EventBoxOpenAllowed";
  allow_open: boolean;
};

export function storeEventBoxOpenAllowed(src: EventBoxOpenAllowed) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(591409854, 32);
    b_0.storeBit(src.allow_open);
  };
}

export function loadEventBoxOpenAllowed(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 591409854) {
    throw Error("Invalid prefix");
  }
  let _allow_open = sc_0.loadBit();
  return { $$type: "EventBoxOpenAllowed" as const, allow_open: _allow_open };
}

function loadTupleEventBoxOpenAllowed(source: TupleReader) {
  let _allow_open = source.readBoolean();
  return { $$type: "EventBoxOpenAllowed" as const, allow_open: _allow_open };
}

function storeTupleEventBoxOpenAllowed(source: EventBoxOpenAllowed) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.allow_open);
  return builder.build();
}

function dictValueParserEventBoxOpenAllowed(): DictionaryValue<EventBoxOpenAllowed> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeEventBoxOpenAllowed(src)).endCell()
      );
    },
    parse: (src) => {
      return loadEventBoxOpenAllowed(src.loadRef().beginParse());
    },
  };
}

export type OwnerUpdateCollectionContent = {
  $$type: "OwnerUpdateCollectionContent";
  content: Cell;
};

export function storeOwnerUpdateCollectionContent(
  src: OwnerUpdateCollectionContent
) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1309694338, 32);
    b_0.storeRef(src.content);
  };
}

export function loadOwnerUpdateCollectionContent(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1309694338) {
    throw Error("Invalid prefix");
  }
  let _content = sc_0.loadRef();
  return { $$type: "OwnerUpdateCollectionContent" as const, content: _content };
}

function loadTupleOwnerUpdateCollectionContent(source: TupleReader) {
  let _content = source.readCell();
  return { $$type: "OwnerUpdateCollectionContent" as const, content: _content };
}

function storeTupleOwnerUpdateCollectionContent(
  source: OwnerUpdateCollectionContent
) {
  let builder = new TupleBuilder();
  builder.writeCell(source.content);
  return builder.build();
}

function dictValueParserOwnerUpdateCollectionContent(): DictionaryValue<OwnerUpdateCollectionContent> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeOwnerUpdateCollectionContent(src)).endCell()
      );
    },
    parse: (src) => {
      return loadOwnerUpdateCollectionContent(src.loadRef().beginParse());
    },
  };
}

export type OpenGiftBox = {
  $$type: "OpenGiftBox";
  nft_item_address: Address;
  item_index: bigint;
};

export function storeOpenGiftBox(src: OpenGiftBox) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2761230956, 32);
    b_0.storeAddress(src.nft_item_address);
    b_0.storeInt(src.item_index, 257);
  };
}

export function loadOpenGiftBox(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2761230956) {
    throw Error("Invalid prefix");
  }
  let _nft_item_address = sc_0.loadAddress();
  let _item_index = sc_0.loadIntBig(257);
  return {
    $$type: "OpenGiftBox" as const,
    nft_item_address: _nft_item_address,
    item_index: _item_index,
  };
}

function loadTupleOpenGiftBox(source: TupleReader) {
  let _nft_item_address = source.readAddress();
  let _item_index = source.readBigNumber();
  return {
    $$type: "OpenGiftBox" as const,
    nft_item_address: _nft_item_address,
    item_index: _item_index,
  };
}

function storeTupleOpenGiftBox(source: OpenGiftBox) {
  let builder = new TupleBuilder();
  builder.writeAddress(source.nft_item_address);
  builder.writeNumber(source.item_index);
  return builder.build();
}

function dictValueParserOpenGiftBox(): DictionaryValue<OpenGiftBox> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeOpenGiftBox(src)).endCell());
    },
    parse: (src) => {
      return loadOpenGiftBox(src.loadRef().beginParse());
    },
  };
}

export type UpdateCollectionContent = {
  $$type: "UpdateCollectionContent";
  content: Cell | null;
};

export function storeUpdateCollectionContent(src: UpdateCollectionContent) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3633117281, 32);
    if (src.content !== null && src.content !== undefined) {
      b_0.storeBit(true).storeRef(src.content);
    } else {
      b_0.storeBit(false);
    }
  };
}

export function loadUpdateCollectionContent(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3633117281) {
    throw Error("Invalid prefix");
  }
  let _content = sc_0.loadBit() ? sc_0.loadRef() : null;
  return { $$type: "UpdateCollectionContent" as const, content: _content };
}

function loadTupleUpdateCollectionContent(source: TupleReader) {
  let _content = source.readCellOpt();
  return { $$type: "UpdateCollectionContent" as const, content: _content };
}

function storeTupleUpdateCollectionContent(source: UpdateCollectionContent) {
  let builder = new TupleBuilder();
  builder.writeCell(source.content);
  return builder.build();
}

function dictValueParserUpdateCollectionContent(): DictionaryValue<UpdateCollectionContent> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeUpdateCollectionContent(src)).endCell()
      );
    },
    parse: (src) => {
      return loadUpdateCollectionContent(src.loadRef().beginParse());
    },
  };
}

export type BatchMint = {
  $$type: "BatchMint";
  number: bigint;
};

export function storeBatchMint(src: BatchMint) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(486115375, 32);
    b_0.storeInt(src.number, 257);
  };
}

export function loadBatchMint(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 486115375) {
    throw Error("Invalid prefix");
  }
  let _number = sc_0.loadIntBig(257);
  return { $$type: "BatchMint" as const, number: _number };
}

function loadTupleBatchMint(source: TupleReader) {
  let _number = source.readBigNumber();
  return { $$type: "BatchMint" as const, number: _number };
}

function storeTupleBatchMint(source: BatchMint) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.number);
  return builder.build();
}

function dictValueParserBatchMint(): DictionaryValue<BatchMint> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeBatchMint(src)).endCell());
    },
    parse: (src) => {
      return loadBatchMint(src.loadRef().beginParse());
    },
  };
}

export type EventGptTokenPurchase = {
  $$type: "EventGptTokenPurchase";
  buyer: Address;
  payment: bigint;
};

export function storeEventGptTokenPurchase(src: EventGptTokenPurchase) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(981883595, 32);
    b_0.storeAddress(src.buyer);
    b_0.storeCoins(src.payment);
  };
}

export function loadEventGptTokenPurchase(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 981883595) {
    throw Error("Invalid prefix");
  }
  let _buyer = sc_0.loadAddress();
  let _payment = sc_0.loadCoins();
  return {
    $$type: "EventGptTokenPurchase" as const,
    buyer: _buyer,
    payment: _payment,
  };
}

function loadTupleEventGptTokenPurchase(source: TupleReader) {
  let _buyer = source.readAddress();
  let _payment = source.readBigNumber();
  return {
    $$type: "EventGptTokenPurchase" as const,
    buyer: _buyer,
    payment: _payment,
  };
}

function storeTupleEventGptTokenPurchase(source: EventGptTokenPurchase) {
  let builder = new TupleBuilder();
  builder.writeAddress(source.buyer);
  builder.writeNumber(source.payment);
  return builder.build();
}

function dictValueParserEventGptTokenPurchase(): DictionaryValue<EventGptTokenPurchase> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeEventGptTokenPurchase(src)).endCell()
      );
    },
    parse: (src) => {
      return loadEventGptTokenPurchase(src.loadRef().beginParse());
    },
  };
}

export type GetRoyaltyParams = {
  $$type: "GetRoyaltyParams";
  query_id: bigint;
};

export function storeGetRoyaltyParams(src: GetRoyaltyParams) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1765620048, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadGetRoyaltyParams(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1765620048) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: "GetRoyaltyParams" as const, query_id: _query_id };
}

function loadTupleGetRoyaltyParams(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: "GetRoyaltyParams" as const, query_id: _query_id };
}

function storeTupleGetRoyaltyParams(source: GetRoyaltyParams) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserGetRoyaltyParams(): DictionaryValue<GetRoyaltyParams> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeGetRoyaltyParams(src)).endCell());
    },
    parse: (src) => {
      return loadGetRoyaltyParams(src.loadRef().beginParse());
    },
  };
}

export type ReportRoyaltyParams = {
  $$type: "ReportRoyaltyParams";
  query_id: bigint;
  numerator: bigint;
  denominator: bigint;
  destination: Address;
};

export function storeReportRoyaltyParams(src: ReportRoyaltyParams) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2831876269, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeUint(src.numerator, 16);
    b_0.storeUint(src.denominator, 16);
    b_0.storeAddress(src.destination);
  };
}

export function loadReportRoyaltyParams(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2831876269) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  let _numerator = sc_0.loadUintBig(16);
  let _denominator = sc_0.loadUintBig(16);
  let _destination = sc_0.loadAddress();
  return {
    $$type: "ReportRoyaltyParams" as const,
    query_id: _query_id,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination,
  };
}

function loadTupleReportRoyaltyParams(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _numerator = source.readBigNumber();
  let _denominator = source.readBigNumber();
  let _destination = source.readAddress();
  return {
    $$type: "ReportRoyaltyParams" as const,
    query_id: _query_id,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination,
  };
}

function storeTupleReportRoyaltyParams(source: ReportRoyaltyParams) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.numerator);
  builder.writeNumber(source.denominator);
  builder.writeAddress(source.destination);
  return builder.build();
}

function dictValueParserReportRoyaltyParams(): DictionaryValue<ReportRoyaltyParams> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeReportRoyaltyParams(src)).endCell()
      );
    },
    parse: (src) => {
      return loadReportRoyaltyParams(src.loadRef().beginParse());
    },
  };
}

export type CollectionData = {
  $$type: "CollectionData";
  next_item_index: bigint;
  collection_content: Cell;
  owner_address: Address;
};

export function storeCollectionData(src: CollectionData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeInt(src.next_item_index, 257);
    b_0.storeRef(src.collection_content);
    b_0.storeAddress(src.owner_address);
  };
}

export function loadCollectionData(slice: Slice) {
  let sc_0 = slice;
  let _next_item_index = sc_0.loadIntBig(257);
  let _collection_content = sc_0.loadRef();
  let _owner_address = sc_0.loadAddress();
  return {
    $$type: "CollectionData" as const,
    next_item_index: _next_item_index,
    collection_content: _collection_content,
    owner_address: _owner_address,
  };
}

function loadTupleCollectionData(source: TupleReader) {
  let _next_item_index = source.readBigNumber();
  let _collection_content = source.readCell();
  let _owner_address = source.readAddress();
  return {
    $$type: "CollectionData" as const,
    next_item_index: _next_item_index,
    collection_content: _collection_content,
    owner_address: _owner_address,
  };
}

function storeTupleCollectionData(source: CollectionData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.next_item_index);
  builder.writeCell(source.collection_content);
  builder.writeAddress(source.owner_address);
  return builder.build();
}

function dictValueParserCollectionData(): DictionaryValue<CollectionData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeCollectionData(src)).endCell());
    },
    parse: (src) => {
      return loadCollectionData(src.loadRef().beginParse());
    },
  };
}

export type RoyaltyParams = {
  $$type: "RoyaltyParams";
  numerator: bigint;
  denominator: bigint;
  destination: Address;
};

export function storeRoyaltyParams(src: RoyaltyParams) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeInt(src.numerator, 257);
    b_0.storeInt(src.denominator, 257);
    b_0.storeAddress(src.destination);
  };
}

export function loadRoyaltyParams(slice: Slice) {
  let sc_0 = slice;
  let _numerator = sc_0.loadIntBig(257);
  let _denominator = sc_0.loadIntBig(257);
  let _destination = sc_0.loadAddress();
  return {
    $$type: "RoyaltyParams" as const,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination,
  };
}

function loadTupleRoyaltyParams(source: TupleReader) {
  let _numerator = source.readBigNumber();
  let _denominator = source.readBigNumber();
  let _destination = source.readAddress();
  return {
    $$type: "RoyaltyParams" as const,
    numerator: _numerator,
    denominator: _denominator,
    destination: _destination,
  };
}

function storeTupleRoyaltyParams(source: RoyaltyParams) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.numerator);
  builder.writeNumber(source.denominator);
  builder.writeAddress(source.destination);
  return builder.build();
}

function dictValueParserRoyaltyParams(): DictionaryValue<RoyaltyParams> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeRoyaltyParams(src)).endCell());
    },
    parse: (src) => {
      return loadRoyaltyParams(src.loadRef().beginParse());
    },
  };
}

export type Transfer = {
  $$type: "Transfer";
  query_id: bigint;
  new_owner: Address;
  response_destination: Address | null;
  custom_payload: Cell | null;
  forward_amount: bigint;
  forward_payload: Cell;
};

export function storeTransfer(src: Transfer) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(1607220500, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.new_owner);
    b_0.storeAddress(src.response_destination);
    if (src.custom_payload !== null && src.custom_payload !== undefined) {
      b_0.storeBit(true).storeRef(src.custom_payload);
    } else {
      b_0.storeBit(false);
    }
    b_0.storeCoins(src.forward_amount);
    b_0.storeBuilder(src.forward_payload.asBuilder());
  };
}

export function loadTransfer(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 1607220500) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  let _new_owner = sc_0.loadAddress();
  let _response_destination = sc_0.loadMaybeAddress();
  let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
  let _forward_amount = sc_0.loadCoins();
  let _forward_payload = sc_0.asCell();
  return {
    $$type: "Transfer" as const,
    query_id: _query_id,
    new_owner: _new_owner,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
    forward_amount: _forward_amount,
    forward_payload: _forward_payload,
  };
}

function loadTupleTransfer(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _new_owner = source.readAddress();
  let _response_destination = source.readAddressOpt();
  let _custom_payload = source.readCellOpt();
  let _forward_amount = source.readBigNumber();
  let _forward_payload = source.readCell();
  return {
    $$type: "Transfer" as const,
    query_id: _query_id,
    new_owner: _new_owner,
    response_destination: _response_destination,
    custom_payload: _custom_payload,
    forward_amount: _forward_amount,
    forward_payload: _forward_payload,
  };
}

function storeTupleTransfer(source: Transfer) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.new_owner);
  builder.writeAddress(source.response_destination);
  builder.writeCell(source.custom_payload);
  builder.writeNumber(source.forward_amount);
  builder.writeSlice(source.forward_payload);
  return builder.build();
}

function dictValueParserTransfer(): DictionaryValue<Transfer> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeTransfer(src)).endCell());
    },
    parse: (src) => {
      return loadTransfer(src.loadRef().beginParse());
    },
  };
}

export type OwnershipAssigned = {
  $$type: "OwnershipAssigned";
  query_id: bigint;
  prev_owner: Address;
  forward_payload: Cell;
};

export function storeOwnershipAssigned(src: OwnershipAssigned) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(85167505, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeAddress(src.prev_owner);
    b_0.storeBuilder(src.forward_payload.asBuilder());
  };
}

export function loadOwnershipAssigned(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 85167505) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  let _prev_owner = sc_0.loadAddress();
  let _forward_payload = sc_0.asCell();
  return {
    $$type: "OwnershipAssigned" as const,
    query_id: _query_id,
    prev_owner: _prev_owner,
    forward_payload: _forward_payload,
  };
}

function loadTupleOwnershipAssigned(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _prev_owner = source.readAddress();
  let _forward_payload = source.readCell();
  return {
    $$type: "OwnershipAssigned" as const,
    query_id: _query_id,
    prev_owner: _prev_owner,
    forward_payload: _forward_payload,
  };
}

function storeTupleOwnershipAssigned(source: OwnershipAssigned) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeAddress(source.prev_owner);
  builder.writeSlice(source.forward_payload);
  return builder.build();
}

function dictValueParserOwnershipAssigned(): DictionaryValue<OwnershipAssigned> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(
        beginCell().store(storeOwnershipAssigned(src)).endCell()
      );
    },
    parse: (src) => {
      return loadOwnershipAssigned(src.loadRef().beginParse());
    },
  };
}

export type Excesses = {
  $$type: "Excesses";
  query_id: bigint;
};

export function storeExcesses(src: Excesses) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(3576854235, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadExcesses(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 3576854235) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: "Excesses" as const, query_id: _query_id };
}

function loadTupleExcesses(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: "Excesses" as const, query_id: _query_id };
}

function storeTupleExcesses(source: Excesses) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserExcesses(): DictionaryValue<Excesses> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeExcesses(src)).endCell());
    },
    parse: (src) => {
      return loadExcesses(src.loadRef().beginParse());
    },
  };
}

export type GetStaticData = {
  $$type: "GetStaticData";
  query_id: bigint;
};

export function storeGetStaticData(src: GetStaticData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(801842850, 32);
    b_0.storeUint(src.query_id, 64);
  };
}

export function loadGetStaticData(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 801842850) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  return { $$type: "GetStaticData" as const, query_id: _query_id };
}

function loadTupleGetStaticData(source: TupleReader) {
  let _query_id = source.readBigNumber();
  return { $$type: "GetStaticData" as const, query_id: _query_id };
}

function storeTupleGetStaticData(source: GetStaticData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  return builder.build();
}

function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
    },
    parse: (src) => {
      return loadGetStaticData(src.loadRef().beginParse());
    },
  };
}

export type ReportStaticData = {
  $$type: "ReportStaticData";
  query_id: bigint;
  index_id: bigint;
  collection: Address;
};

export function storeReportStaticData(src: ReportStaticData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeUint(2339837749, 32);
    b_0.storeUint(src.query_id, 64);
    b_0.storeInt(src.index_id, 257);
    b_0.storeAddress(src.collection);
  };
}

export function loadReportStaticData(slice: Slice) {
  let sc_0 = slice;
  if (sc_0.loadUint(32) !== 2339837749) {
    throw Error("Invalid prefix");
  }
  let _query_id = sc_0.loadUintBig(64);
  let _index_id = sc_0.loadIntBig(257);
  let _collection = sc_0.loadAddress();
  return {
    $$type: "ReportStaticData" as const,
    query_id: _query_id,
    index_id: _index_id,
    collection: _collection,
  };
}

function loadTupleReportStaticData(source: TupleReader) {
  let _query_id = source.readBigNumber();
  let _index_id = source.readBigNumber();
  let _collection = source.readAddress();
  return {
    $$type: "ReportStaticData" as const,
    query_id: _query_id,
    index_id: _index_id,
    collection: _collection,
  };
}

function storeTupleReportStaticData(source: ReportStaticData) {
  let builder = new TupleBuilder();
  builder.writeNumber(source.query_id);
  builder.writeNumber(source.index_id);
  builder.writeAddress(source.collection);
  return builder.build();
}

function dictValueParserReportStaticData(): DictionaryValue<ReportStaticData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeReportStaticData(src)).endCell());
    },
    parse: (src) => {
      return loadReportStaticData(src.loadRef().beginParse());
    },
  };
}

export type GetNftData = {
  $$type: "GetNftData";
  is_initialized: boolean;
  index: bigint;
  collection_address: Address;
  owner_address: Address;
  individual_content: Cell;
};

export function storeGetNftData(src: GetNftData) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeBit(src.is_initialized);
    b_0.storeInt(src.index, 257);
    b_0.storeAddress(src.collection_address);
    b_0.storeAddress(src.owner_address);
    b_0.storeRef(src.individual_content);
  };
}

export function loadGetNftData(slice: Slice) {
  let sc_0 = slice;
  let _is_initialized = sc_0.loadBit();
  let _index = sc_0.loadIntBig(257);
  let _collection_address = sc_0.loadAddress();
  let _owner_address = sc_0.loadAddress();
  let _individual_content = sc_0.loadRef();
  return {
    $$type: "GetNftData" as const,
    is_initialized: _is_initialized,
    index: _index,
    collection_address: _collection_address,
    owner_address: _owner_address,
    individual_content: _individual_content,
  };
}

function loadTupleGetNftData(source: TupleReader) {
  let _is_initialized = source.readBoolean();
  let _index = source.readBigNumber();
  let _collection_address = source.readAddress();
  let _owner_address = source.readAddress();
  let _individual_content = source.readCell();
  return {
    $$type: "GetNftData" as const,
    is_initialized: _is_initialized,
    index: _index,
    collection_address: _collection_address,
    owner_address: _owner_address,
    individual_content: _individual_content,
  };
}

function storeTupleGetNftData(source: GetNftData) {
  let builder = new TupleBuilder();
  builder.writeBoolean(source.is_initialized);
  builder.writeNumber(source.index);
  builder.writeAddress(source.collection_address);
  builder.writeAddress(source.owner_address);
  builder.writeCell(source.individual_content);
  return builder.build();
}

function dictValueParserGetNftData(): DictionaryValue<GetNftData> {
  return {
    serialize: (src, buidler) => {
      buidler.storeRef(beginCell().store(storeGetNftData(src)).endCell());
    },
    parse: (src) => {
      return loadGetNftData(src.loadRef().beginParse());
    },
  };
}

type NftCollection_init_args = {
  $$type: "NftCollection_init_args";
  owner_address: Address;
  collection_content: Cell;
  allow_open: boolean;
  royalty_params: RoyaltyParams;
  total_supply: bigint;
};

function initNftCollection_init_args(src: NftCollection_init_args) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeAddress(src.owner_address);
    b_0.storeRef(src.collection_content);
    b_0.storeBit(src.allow_open);
    let b_1 = new Builder();
    b_1.store(storeRoyaltyParams(src.royalty_params));
    let b_2 = new Builder();
    b_2.storeInt(src.total_supply, 257);
    b_1.storeRef(b_2.endCell());
    b_0.storeRef(b_1.endCell());
  };
}

async function NftCollection_init(
  owner_address: Address,
  collection_content: Cell,
  allow_open: boolean,
  royalty_params: RoyaltyParams,
  total_supply: bigint
) {
  const __code = Cell.fromBase64(
    "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"
  );
  const __system = Cell.fromBase64(
    "te6cckECYAEAEawAAQHAAQIBID8CAQW9ESwDART/APSkE/S88sgLBAIBYiMFAgEgFgYCASAPBwIBIAoIAhG39jtnm2eNjjA7CQACIQIBIEYLAgFYDgwCEKv22zzbPGxxOw0AAiAAdKm7jQ1aXBmczovL1FtZlVVU0JDV3l2OU4zZHNSZThCNWtoaWFlZVp5QWlMY0xmakxkSk1kQ21pZnCACASAQSAIBahQRAhCqwNs82zxscTsSAQ74J28Qeds8EwDaIMEBIcJNsfLQhsgiwQCYgC0BywcCowLef3BvAASOGwR6qQwgwABSMLCzm3AzpjAUb4wEpAQDkTDiBOQBs5cCgC5vjAKk3o4QA3qpDKYwE2+MA6QiwAAQNOYzIqUDmlMSb4EBywcCpQLkbCHJ0AIQqFvbPNs8bHM7FQJoyG8AAW+MbW+MJNDbPIv2NvbGxlY3Rpb24uanNvbo2zxvIgHJkyFus5YBbyJZzMnoMVRncU1NAgEgHxcCASAaGAIVtPR7Z4qg22eNjjA7GQGG2zxwWchwAcsBcwHLAXABywASzMzJ+QDIcgHLAXABywASygfL/8nQINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiDkCASAdGwIRsmD2zzbPGxxgOxwAAiICEbO19s82zxsc4DseABAkIG7y0IBvIwIBICEgAhW3lttniqDbZ42OUDs5AhW1a7tniqLbZ42OMDsiAT4xyG8AAW+MbW+MAdDbPG8iAcmTIW6zlgFvIlnMyegxTQOa0AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRbbPPLggsj4QwHMfwHKAFVg2zzJ7VQ7JyQC9lBnyx9QBCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFsgjbrOOOX8BygADIG7y0IBvIxA1UCOBAQHPAIEBAc8AASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFpYzcFADygDizCJus5UycFjKAOMNEsoAAiYlABjIgQEBzwDJWMzJAcwADH8BygASzAL07aLt+wGSMH/gcCHXScIflTAg1wsf3iCCEE4QWYK6jk4w0x8BghBOEFmCuvLggdQBMWwi+EFvJBAjXwMlgQ6WAscF8vR/f8gBghAjQDK+WMsfygDJyIJYwAAAAAAAAAAAAAAAAQHLZ8zJcPsAWH/gIIIQm62km7rjAiA0KARKghA1Q+VduuMCIIIQHPmIL7rjAiCCEKSVCmy64wIgghBpPTlQujIxLykC/I70MNMfAYIQaT05ULry4IHTPwEx+EFvJBAjXwNwgEBwKSBu8tCAbyNbKiBu8tCAbyMwMSwQN8hVMIIQqMsArVAFyx8Tyz/LD8sPASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFskQNEEwFEMwbW3bPH/gwACRMOMNcFoqA/T5ASCC8KwOZvEptkTgOQZ2hhieezEnTAYrGWoYC4IoXR9PhL2XuuMCIILwJHx71fOeIljYCsNqBBmhq1d5dXglpswOkVNo8AYQoYq6joYw2zx/2zHggvC+spNaggibFU0y+ZxDd6qWCqEVNmzCxgJ1Xja5f1Bc7LrjAi4sKwFmgTyV+EJScMcF8vT4Qn/4J28Q+EFvJBNfA6GCEATEtAChggr68IChgEIQI21tbds8f9sxWgLwgWmNU3G78vT4QW8kMDKBE/34QW8kE18DghAHJw4AvvL0+CdvECKhggr68IBmtgihghAExLQAoBKh2zz4QvgQUoDIVSCCECmhSstQBMsfWCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFoEBAc8AgQEBzwDJNi0AMMiCWMAAAAAAAAAAAAAAAAEBy2fMyXD7AADaMIET/fhBbyQTXwOCEAX14QC+8vT4QW8kECNfA/hBbyQTXwPIWYIQOoZay1ADyx8BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WAfoCyciCWMAAAAAAAAAAAAAAAAEBy2fMyXD7AH/bMQHIMNMfAYIQpJUKbLry4IH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAYEBAdcAWWwSW4IAhUsiwP/y9CLIAYIQ2Iz4YVjLHyFus5V/AcoAzJRwMsoA4sn4QgF/bds8fzABOm1tIm6zmVsgbvLQgG8iAZEy4hAkcAMEgEJQI9s8WgHkMNMfAYIQHPmIL7ry4IGBAQHXAAExgWmNU4GgI7vy9PhBbyQwMiKCEAcnDgCogRP9+EFvJBNfA1i+8vT4J28QIqGCCvrwgGa2CKGCEATEtACgEqEijphTAqkEEHoQaRBYEEoQOUigUoDbPBBpVSXkXwN/NgL4MNMfAYIQNUPlXbry4IH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIMYFpjVOCu/L0+EFvJDAygRP9+EFvJBNfA4IQBycOAL7y9PgnbxAioYIK+vCAZrYIoYIQBMS0AKASoasAEHleNRBIEDlIkFKQ2zxVFts8fzYzATQggUijA8cFsxLy9IIQC+vCAHByQzBtbW3bPFoBXDDTHwGCEJutpJu68uCB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiDE1ArSBaY1Tgrvy9PhBbyQwMoET/fhBbyQTXwOCEAcnDgC+8vT4J28QIqGCCvrwgGa2CKGCEATEtACgEqEgqwAQil42EFkQShA5SqDbPAirABBoEFcQRhA1RDDbPH82NgT2ggD1FinCAPL0KAcQaAUQSEgzCds8XHBZyHABywFzAcsBcAHLABLMzMn5AMhyAcsBcAHLABLKB8v/ydAg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIcHJwIMjJ0BAjEC8tVEwwyFVQ2zzJECYQXRQQPEAcEEYQRds8OThaNwAOBKQGEDVEMADYghBfzD0UUAfLHxXLP1ADINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WASBulTBwAcsBjh4g10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbiIW6zlX8BygDMlHAyygDiAfoCAc8WAQ74Q/goWNs8OgCiAtD0BDBtAYF56gGAEPQPb6Hy4IcBgXnqIgKAEPQXyAHI9ADJAcxwAcoAQANZINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WgQEBzwDJAvbtRNDUAfhj0gAB4wL4KNcLCoMJuvLgifpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgB1NIA1AHQgQEB1wCBAQHXAPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhDMAPUMNCBAQHXADAQRxBGEEVBMAc+PAEK0VUF2zw9ABw0cW1QQ3ADbwMQNhA1BADs0x/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAdQB0NIAAY4tgQEB1wCBAQHXAPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhDMG8DkW3iAdTSAAGR1JJtAeLSANQw0IEBAdcAMBBXEFZsFwEFv89UQAEU/wD0pBP0vPLIC0ECAWJQQgIBIE5DAgEgR0QCAUhGRQB1sm7jQ1aXBmczovL1FtWW9vc3I1OGpLZjFzUE5TVW1oRzIxQzJYS1hKMkJTZVhYYVBLZUoxdDVZWkOCAAEbCvu1E0NIAAYAIBIElIAJW3ejBOC52Hq6WVz2PQnYc6yVCjbNBOE7rGpaVsj5ZkWnXlv74sRzBOBAq4A3AM7HKZywdVyOS2WHBOE7Lpy1Zp2W5nQdLNsozdFJACEbX5+2ebZ42KsF1KBDzIbwABb4xtb4whIG7y0IDQ2zwk2zzbPItS5qc29uhNTE1LAUDbPCIgbvLQgAFvIgHJkyFus5YBbyJZzMnoMSRURjAoWU0A3sghwQCYgC0BywcBowHeIYI4Mnyyc0EZ07epqh25jiBwIHGOFAR6qQymMCWoEqAEqgcCpCHAAEUw5jAzqgLPAY4rbwBwjhEjeqkIEm+MAaQDeqkEIMAAFOYzIqUDnFMCb4GmMFjLBwKlWeQwMeLJ0AC6INdKIddJlyDCACLCALGOSgNvIoB/Is8xqwKhBasCUVW2CCDCAJwgqgIV1xhQM88WQBTeWW8CU0GhwgCZyAFvAlBEoaoCjhIxM8IAmdQw0CDXSiHXSZJwIOLi6F8DAhG/vPbZ5tnjYoxdTwACJAN60AHQ0wMBcbCjAfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IhUUFMDbwT4YQL4Yts8VRTbPPLggl1SUQDeyPhDAcx/AcoAVUBQVCDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFhKBAQHPAMoAWCBulTBwAcsBjh4g10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxbiIW6zlX8BygDMlHAyygDiye1UBPbtou37AZIwf+BwIddJwh+VMCDXCx/eIIIQX8w9FLqP2jDbPGwW+EFvJCH4J28QIaGCCvrwgGa2CKGCEATEtACgoS3AAI6wNFs4OFs2J4FrawXHBRTy9H8DIG7y0IBxA8gBghDVMnbbWMsfyz/JRTB/VTBtbds84w4Cf+BcWldTA/wgghAvyyaiuo7iMNMfAYIQL8smorry4IHTPwEx+EFvJBAjXwNwgEB/VDSJyFUgghCLdxc1UATLHxLLP4EBAc8AASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFskQNEEwFEMwbW3bPH/gIIIQ2Iz4YbrjAsAAkTDjDXBaVlQBiPkBgvC7klVcMnXWHshz5rqchW+G3QK4JI6CT7pKu/Zs0/EaVrqOnPhBbyQwMiOCAMCAAiFukltwkscF4vL02zx/2zHgVQGUMPgnbxCCCvrwgKFy+CgmyFmCEKSVCmxQA8sfASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFoEBAc8AySdVIH9VMG1t2zxaAFgw0x8BghDYjPhhuvLggdIAAZHUkm0B4gExMfhBbyQQI18DJYEY9QLHBfL0fwPeN4IAwIAMIG7y0IAjxwUc8vRTdMIAjsVxU6N/CMhVIIIQBRONkVAEyx8Syz8BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WAc8WyScQSwNQdxRDMG1t2zySNDfiQDkW2zyhIW6zkl8E4w0CWllYAUgBIG7y0IACoXF/BMgBghDVMnbbWMsfyz/JEDRBMBRDMG1t2zxaAGRsMfpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4Igw+gAxcdch+gAx+gAwpwOrAAHKyHEBygFQBwHKAHABygJQBSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAD+gJwAcpoI26zkX+TJG6z4pczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wBbAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMANjTHwGCEF/MPRS68uCB0z/6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIAfpAIdcLAcMAjh0BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiJIxbeIB0gABkdSSbQHi+gBRVRUUQzAB8O1E0NQB+GPSAAGOYPpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wDSAPpAIdcLAcMAjh0BINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiJIxbeIB0gABkdSSbQHiVUBsFeD4KNcLCoMJuvLgiV4BVvpAASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IgBgQEB1wBZAtEB2zxfACBtbYIAwT34QlJQxwXy9HBZhbKfeg=="
  );
  let builder = beginCell();
  builder.storeRef(__system);
  builder.storeUint(0, 1);
  initNftCollection_init_args({
    $$type: "NftCollection_init_args",
    owner_address,
    collection_content,
    allow_open,
    royalty_params,
    total_supply,
  })(builder);
  const __data = builder.endCell();
  return { code: __code, data: __data };
}

const NftCollection_errors: { [key: number]: { message: string } } = {
  2: { message: `Stack undeflow` },
  3: { message: `Stack overflow` },
  4: { message: `Integer overflow` },
  5: { message: `Integer out of expected range` },
  6: { message: `Invalid opcode` },
  7: { message: `Type check error` },
  8: { message: `Cell overflow` },
  9: { message: `Cell underflow` },
  10: { message: `Dictionary error` },
  13: { message: `Out of gas error` },
  32: { message: `Method ID not found` },
  34: { message: `Action is invalid or not supported` },
  37: { message: `Not enough TON` },
  38: { message: `Not enough extra-currencies` },
  128: { message: `Null reference exception` },
  129: { message: `Invalid serialization prefix` },
  130: { message: `Invalid incoming message` },
  131: { message: `Constraints error` },
  132: { message: `Access denied` },
  133: { message: `Contract stopped` },
  134: { message: `Invalid argument` },
  135: { message: `Code of a contract was not found` },
  136: { message: `Invalid address` },
  137: { message: `Masterchain support is not enabled for this contract` },
  3734: { message: `Not Owner` },
  5117: { message: `Insuffcient Funds` },
  6389: { message: `not valid` },
  15509: { message: `Only deployer is allowed to withdraw` },
  18595: { message: `Invalid Action` },
  27021: { message: `Total Supply Excceed` },
  27499: { message: `initialized tx need from collection` },
  34123: { message: `action not allowed` },
  49280: { message: `not owner` },
  49469: { message: `not from collection` },
  62742: { message: `non-sequential NFTs` },
};

const NftCollection_types: ABIType[] = [
  {
    name: "StateInit",
    header: null,
    fields: [
      { name: "code", type: { kind: "simple", type: "cell", optional: false } },
      { name: "data", type: { kind: "simple", type: "cell", optional: false } },
    ],
  },
  {
    name: "Context",
    header: null,
    fields: [
      {
        name: "bounced",
        type: { kind: "simple", type: "bool", optional: false },
      },
      {
        name: "sender",
        type: { kind: "simple", type: "address", optional: false },
      },
      {
        name: "value",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      { name: "raw", type: { kind: "simple", type: "slice", optional: false } },
    ],
  },
  {
    name: "SendParameters",
    header: null,
    fields: [
      {
        name: "bounce",
        type: { kind: "simple", type: "bool", optional: false },
      },
      {
        name: "to",
        type: { kind: "simple", type: "address", optional: false },
      },
      {
        name: "value",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      {
        name: "mode",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      { name: "body", type: { kind: "simple", type: "cell", optional: true } },
      { name: "code", type: { kind: "simple", type: "cell", optional: true } },
      { name: "data", type: { kind: "simple", type: "cell", optional: true } },
    ],
  },
  {
    name: "EventMintRecord",
    header: 698436299,
    fields: [
      {
        name: "minter",
        type: { kind: "simple", type: "address", optional: false },
      },
      {
        name: "item_id",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      {
        name: "generate_number",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
    ],
  },
  {
    name: "Referral",
    header: 2611848347,
    fields: [
      {
        name: "referred_by",
        type: { kind: "simple", type: "address", optional: false },
      },
    ],
  },
  {
    name: "ReferralWithTon",
    header: 893642077,
    fields: [
      {
        name: "referred_by",
        type: { kind: "simple", type: "address", optional: false },
      },
    ],
  },
  {
    name: "EventBoxOpenAllowed",
    header: 591409854,
    fields: [
      {
        name: "allow_open",
        type: { kind: "simple", type: "bool", optional: false },
      },
    ],
  },
  {
    name: "OwnerUpdateCollectionContent",
    header: 1309694338,
    fields: [
      {
        name: "content",
        type: { kind: "simple", type: "cell", optional: false },
      },
    ],
  },
  {
    name: "OpenGiftBox",
    header: 2761230956,
    fields: [
      {
        name: "nft_item_address",
        type: { kind: "simple", type: "address", optional: false },
      },
      {
        name: "item_index",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
    ],
  },
  {
    name: "UpdateCollectionContent",
    header: 3633117281,
    fields: [
      {
        name: "content",
        type: { kind: "simple", type: "cell", optional: true },
      },
    ],
  },
  {
    name: "BatchMint",
    header: 486115375,
    fields: [
      {
        name: "number",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
    ],
  },
  {
    name: "EventGptTokenPurchase",
    header: 981883595,
    fields: [
      {
        name: "buyer",
        type: { kind: "simple", type: "address", optional: false },
      },
      {
        name: "payment",
        type: {
          kind: "simple",
          type: "uint",
          optional: false,
          format: "coins",
        },
      },
    ],
  },
  {
    name: "GetRoyaltyParams",
    header: 1765620048,
    fields: [
      {
        name: "query_id",
        type: { kind: "simple", type: "uint", optional: false, format: 64 },
      },
    ],
  },
  {
    name: "ReportRoyaltyParams",
    header: 2831876269,
    fields: [
      {
        name: "query_id",
        type: { kind: "simple", type: "uint", optional: false, format: 64 },
      },
      {
        name: "numerator",
        type: { kind: "simple", type: "uint", optional: false, format: 16 },
      },
      {
        name: "denominator",
        type: { kind: "simple", type: "uint", optional: false, format: 16 },
      },
      {
        name: "destination",
        type: { kind: "simple", type: "address", optional: false },
      },
    ],
  },
  {
    name: "CollectionData",
    header: null,
    fields: [
      {
        name: "next_item_index",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      {
        name: "collection_content",
        type: { kind: "simple", type: "cell", optional: false },
      },
      {
        name: "owner_address",
        type: { kind: "simple", type: "address", optional: false },
      },
    ],
  },
  {
    name: "RoyaltyParams",
    header: null,
    fields: [
      {
        name: "numerator",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      {
        name: "denominator",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      {
        name: "destination",
        type: { kind: "simple", type: "address", optional: false },
      },
    ],
  },
  {
    name: "Transfer",
    header: 1607220500,
    fields: [
      {
        name: "query_id",
        type: { kind: "simple", type: "uint", optional: false, format: 64 },
      },
      {
        name: "new_owner",
        type: { kind: "simple", type: "address", optional: false },
      },
      {
        name: "response_destination",
        type: { kind: "simple", type: "address", optional: true },
      },
      {
        name: "custom_payload",
        type: { kind: "simple", type: "cell", optional: true },
      },
      {
        name: "forward_amount",
        type: {
          kind: "simple",
          type: "uint",
          optional: false,
          format: "coins",
        },
      },
      {
        name: "forward_payload",
        type: {
          kind: "simple",
          type: "slice",
          optional: false,
          format: "remainder",
        },
      },
    ],
  },
  {
    name: "OwnershipAssigned",
    header: 85167505,
    fields: [
      {
        name: "query_id",
        type: { kind: "simple", type: "uint", optional: false, format: 64 },
      },
      {
        name: "prev_owner",
        type: { kind: "simple", type: "address", optional: false },
      },
      {
        name: "forward_payload",
        type: {
          kind: "simple",
          type: "slice",
          optional: false,
          format: "remainder",
        },
      },
    ],
  },
  {
    name: "Excesses",
    header: 3576854235,
    fields: [
      {
        name: "query_id",
        type: { kind: "simple", type: "uint", optional: false, format: 64 },
      },
    ],
  },
  {
    name: "GetStaticData",
    header: 801842850,
    fields: [
      {
        name: "query_id",
        type: { kind: "simple", type: "uint", optional: false, format: 64 },
      },
    ],
  },
  {
    name: "ReportStaticData",
    header: 2339837749,
    fields: [
      {
        name: "query_id",
        type: { kind: "simple", type: "uint", optional: false, format: 64 },
      },
      {
        name: "index_id",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      {
        name: "collection",
        type: { kind: "simple", type: "address", optional: false },
      },
    ],
  },
  {
    name: "GetNftData",
    header: null,
    fields: [
      {
        name: "is_initialized",
        type: { kind: "simple", type: "bool", optional: false },
      },
      {
        name: "index",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      {
        name: "collection_address",
        type: { kind: "simple", type: "address", optional: false },
      },
      {
        name: "owner_address",
        type: { kind: "simple", type: "address", optional: false },
      },
      {
        name: "individual_content",
        type: { kind: "simple", type: "cell", optional: false },
      },
    ],
  },
];

const NftCollection_getters: ABIGetter[] = [
  {
    name: "get_collection_data",
    arguments: [],
    returnType: { kind: "simple", type: "CollectionData", optional: false },
  },
  {
    name: "get_nft_address_by_index",
    arguments: [
      {
        name: "item_index",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
    ],
    returnType: { kind: "simple", type: "address", optional: true },
  },
  {
    name: "getNftItemInit",
    arguments: [
      {
        name: "item_index",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
    ],
    returnType: { kind: "simple", type: "StateInit", optional: false },
  },
  {
    name: "get_nft_content",
    arguments: [
      {
        name: "index",
        type: { kind: "simple", type: "int", optional: false, format: 257 },
      },
      {
        name: "individual_content",
        type: { kind: "simple", type: "cell", optional: false },
      },
    ],
    returnType: { kind: "simple", type: "cell", optional: false },
  },
  {
    name: "royalty_params",
    arguments: [],
    returnType: { kind: "simple", type: "RoyaltyParams", optional: false },
  },
  {
    name: "get_updated_collection_content",
    arguments: [],
    returnType: { kind: "simple", type: "cell", optional: true },
  },
  {
    name: "get_total_supply",
    arguments: [],
    returnType: { kind: "simple", type: "int", optional: false, format: 257 },
  },
  {
    name: "get_allow_open",
    arguments: [],
    returnType: { kind: "simple", type: "bool", optional: false },
  },
  {
    name: "balance",
    arguments: [],
    returnType: { kind: "simple", type: "string", optional: false },
  },
];

const NftCollection_receivers: ABIReceiver[] = [
  {
    receiver: "internal",
    message: { kind: "typed", type: "OwnerUpdateCollectionContent" },
  },
  { receiver: "internal", message: { kind: "text", text: "GptTokenPurchase" } },
  { receiver: "internal", message: { kind: "text", text: "Mint" } },
  { receiver: "internal", message: { kind: "typed", type: "Referral" } },
  { receiver: "internal", message: { kind: "typed", type: "ReferralWithTon" } },
  { receiver: "internal", message: { kind: "typed", type: "BatchMint" } },
  { receiver: "internal", message: { kind: "typed", type: "OpenGiftBox" } },
  { receiver: "internal", message: { kind: "text", text: "withdraw safe" } },
  {
    receiver: "internal",
    message: { kind: "typed", type: "GetRoyaltyParams" },
  },
];

export class NftCollection implements Contract {
  static async init(
    owner_address: Address,
    collection_content: Cell,
    allow_open: boolean,
    royalty_params: RoyaltyParams,
    total_supply: bigint
  ) {
    return await NftCollection_init(
      owner_address,
      collection_content,
      allow_open,
      royalty_params,
      total_supply
    );
  }

  static async fromInit(
    owner_address: Address,
    collection_content: Cell,
    allow_open: boolean,
    royalty_params: RoyaltyParams,
    total_supply: bigint
  ) {
    const init = await NftCollection_init(
      owner_address,
      collection_content,
      allow_open,
      royalty_params,
      total_supply
    );
    const address = contractAddress(0, init);
    return new NftCollection(address, init);
  }

  static fromAddress(address: Address) {
    return new NftCollection(address);
  }

  readonly address: Address;
  readonly init?: { code: Cell; data: Cell };
  readonly abi: ContractABI = {
    types: NftCollection_types,
    getters: NftCollection_getters,
    receivers: NftCollection_receivers,
    errors: NftCollection_errors,
  };

  private constructor(address: Address, init?: { code: Cell; data: Cell }) {
    this.address = address;
    this.init = init;
  }

  async send(
    provider: ContractProvider,
    via: Sender,
    args: { value: bigint; bounce?: boolean | null | undefined },
    message:
      | OwnerUpdateCollectionContent
      | "GptTokenPurchase"
      | "Mint"
      | Referral
      | ReferralWithTon
      | BatchMint
      | OpenGiftBox
      | "withdraw safe"
      | GetRoyaltyParams
  ) {
    let body: Cell | null = null;
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "OwnerUpdateCollectionContent"
    ) {
      body = beginCell()
        .store(storeOwnerUpdateCollectionContent(message))
        .endCell();
    }
    if (message === "GptTokenPurchase") {
      body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
    }
    if (message === "Mint") {
      body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
    }
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "Referral"
    ) {
      body = beginCell().store(storeReferral(message)).endCell();
    }
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "ReferralWithTon"
    ) {
      body = beginCell().store(storeReferralWithTon(message)).endCell();
    }
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "BatchMint"
    ) {
      body = beginCell().store(storeBatchMint(message)).endCell();
    }
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "OpenGiftBox"
    ) {
      body = beginCell().store(storeOpenGiftBox(message)).endCell();
    }
    if (message === "withdraw safe") {
      body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
    }
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "GetRoyaltyParams"
    ) {
      body = beginCell().store(storeGetRoyaltyParams(message)).endCell();
    }
    if (body === null) {
      throw new Error("Invalid message type");
    }

    await provider.internal(via, { ...args, body: body });
  }

  async getGetCollectionData(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get("get_collection_data", builder.build()))
      .stack;
    const result = loadTupleCollectionData(source);
    return result;
  }

  async getGetNftAddressByIndex(
    provider: ContractProvider,
    item_index: bigint
  ) {
    let builder = new TupleBuilder();
    builder.writeNumber(item_index);
    let source = (
      await provider.get("get_nft_address_by_index", builder.build())
    ).stack;
    let result = source.readAddressOpt();
    return result;
  }

  async getGetNftItemInit(provider: ContractProvider, item_index: bigint) {
    let builder = new TupleBuilder();
    builder.writeNumber(item_index);
    let source = (await provider.get("getNftItemInit", builder.build())).stack;
    const result = loadTupleStateInit(source);
    return result;
  }

  async getGetNftContent(
    provider: ContractProvider,
    index: bigint,
    individual_content: Cell
  ) {
    let builder = new TupleBuilder();
    builder.writeNumber(index);
    builder.writeCell(individual_content);
    let source = (await provider.get("get_nft_content", builder.build())).stack;
    let result = source.readCell();
    return result;
  }

  async getRoyaltyParams(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get("royalty_params", builder.build())).stack;
    const result = loadTupleRoyaltyParams(source);
    return result;
  }

  async getGetUpdatedCollectionContent(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (
      await provider.get("get_updated_collection_content", builder.build())
    ).stack;
    let result = source.readCellOpt();
    return result;
  }

  async getGetTotalSupply(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get("get_total_supply", builder.build()))
      .stack;
    let result = source.readBigNumber();
    return result;
  }

  async getGetAllowOpen(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get("get_allow_open", builder.build())).stack;
    let result = source.readBoolean();
    return result;
  }

  async getBalance(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get("balance", builder.build())).stack;
    let result = source.readString();
    return result;
  }
}

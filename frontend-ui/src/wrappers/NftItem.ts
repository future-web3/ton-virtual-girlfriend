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

type NftItem_init_args = {
  $$type: "NftItem_init_args";
  collection_address: Address;
  item_index: bigint;
};

function initNftItem_init_args(src: NftItem_init_args) {
  return (builder: Builder) => {
    let b_0 = builder;
    b_0.storeAddress(src.collection_address);
    b_0.storeInt(src.item_index, 257);
  };
}

async function NftItem_init(collection_address: Address, item_index: bigint) {
  const __code = Cell.fromBase64(
    "te6ccgECIAEABxYAART/APSkE/S88sgLAQIBYgIDA3rQAdDTAwFxsKMB+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiFRQUwNvBPhhAvhi2zxVFNs88uCCFwQFAgEgEBEE9u2i7fsBkjB/4HAh10nCH5UwINcLH94gghBfzD0Uuo/aMNs8bBb4QW8kIfgnbxAhoYIK+vCAZrYIoYIQBMS0AKChLcAAjrA0Wzg4WzYngWtrBccFFPL0fwMgbvLQgHEDyAGCENUydttYyx/LP8lFMH9VMG1t2zzjDgJ/4AYOBwgA3sj4QwHMfwHKAFVAUFQg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYSgQEBzwDKAFggbpUwcAHLAY4eINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8W4iFus5V/AcoAzJRwMsoA4sntVADY0x8BghBfzD0UuvLggdM/+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAH6QCHXCwHDAI4dASDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IiSMW3iAdIAAZHUkm0B4voAUVUVFEMwA943ggDAgAwgbvLQgCPHBRzy9FN0wgCOxXFTo38IyFUgghAFE42RUATLHxLLPwEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxYBzxbJJxBLA1B3FEMwbW3bPJI0N+JAORbbPKEhbrOSXwTjDQIOCQoD/CCCEC/LJqK6juIw0x8BghAvyyaiuvLggdM/ATH4QW8kECNfA3CAQH9UNInIVSCCEIt3FzVQBMsfEss/gQEBzwABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiM8WyRA0QTAUQzBtbds8f+AgghDYjPhhuuMCwACRMOMNcA4LDABkbDH6QAEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIMPoAMXHXIfoAMfoAMKcDqwABSAEgbvLQgAKhcX8EyAGCENUydttYyx/LP8kQNEEwFEMwbW3bPA4AWDDTHwGCENiM+GG68uCB0gABkdSSbQHiATEx+EFvJBAjXwMlgRj1AscF8vR/AYj5AYLwu5JVXDJ11h7Ic+a6nIVvht0CuCSOgk+6Srv2bNPxGla6jpz4QW8kMDIjggDAgAIhbpJbcJLHBeLy9Ns8f9sx4A0BlDD4J28Qggr68IChcvgoJshZghCklQpsUAPLHwEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIzxaBAQHPAMknVSB/VTBtbds8DgHKyHEBygFQBwHKAHABygJQBSDXSYEBC7ry4Igg1wsKIIEE/7ry0ImDCbry4IjPFlAD+gJwAcpoI26zkX+TJG6z4pczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wAPAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjMAhG/vPbZ5tnjYowXEgIBIBMUAAIkAgEgFRYCAUgeHwIRtfn7Z5tnjYqwFxgAlbd6ME4LnYerpZXPY9CdhzrJUKNs0E4TusalpWyPlmRadeW/vixHME4ECrgDcAzscpnLB1XI5LZYcE4TsunLVmnZbmdB0s2yjN0UkAHw7UTQ1AH4Y9IAAY5g+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXANIA+kAh1wsBwwCOHQEg10mBAQu68uCIINcLCiCBBP+68tCJgwm68uCIkjFt4gHSAAGR1JJtAeJVQGwV4Pgo1wsKgwm68uCJGQQ8yG8AAW+MbW+MISBu8tCA0Ns8JNs82zyLUuanNvboHRsdHAFW+kABINdJgQELuvLgiCDXCwoggQT/uvLQiYMJuvLgiAGBAQHXAFkC0QHbPBoAIG1tggDBPfhCUlDHBfL0cFkA3sghwQCYgC0BywcBowHeIYI4Mnyyc0EZ07epqh25jiBwIHGOFAR6qQymMCWoEqAEqgcCpCHAAEUw5jAzqgLPAY4rbwBwjhEjeqkIEm+MAaQDeqkEIMAAFOYzIqUDnFMCb4GmMFjLBwKlWeQwMeLJ0AFA2zwiIG7y0IABbyIByZMhbrOWAW8iWczJ6DEkVEYwKFkdALog10oh10mXIMIAIsIAsY5KA28igH8izzGrAqEFqwJRVbYIIMIAnCCqAhXXGFAzzxZAFN5ZbwJTQaHCAJnIAW8CUEShqgKOEjEzwgCZ1DDQINdKIddJknAg4uLoXwMAEbCvu1E0NIAAYAB1sm7jQ1aXBmczovL1FtWW9vc3I1OGpLZjFzUE5TVW1oRzIxQzJYS1hKMkJTZVhYYVBLZUoxdDVZWkOCA="
  );
  const __system = Cell.fromBase64(
    "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"
  );
  let builder = beginCell();
  builder.storeRef(__system);
  builder.storeUint(0, 1);
  initNftItem_init_args({
    $$type: "NftItem_init_args",
    collection_address,
    item_index,
  })(builder);
  const __data = builder.endCell();
  return { code: __code, data: __data };
}

const NftItem_errors: { [key: number]: { message: string } } = {
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

const NftItem_types: ABIType[] = [
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

const NftItem_getters: ABIGetter[] = [
  {
    name: "get_nft_data",
    arguments: [],
    returnType: { kind: "simple", type: "GetNftData", optional: false },
  },
  {
    name: "get_collection_address",
    arguments: [],
    returnType: { kind: "simple", type: "address", optional: false },
  },
];

const NftItem_receivers: ABIReceiver[] = [
  { receiver: "internal", message: { kind: "typed", type: "Transfer" } },
  { receiver: "internal", message: { kind: "typed", type: "GetStaticData" } },
  { receiver: "internal", message: { kind: "text", text: "update" } },
  {
    receiver: "internal",
    message: { kind: "typed", type: "UpdateCollectionContent" },
  },
];

export class NftItem implements Contract {
  static async init(collection_address: Address, item_index: bigint) {
    return await NftItem_init(collection_address, item_index);
  }

  static async fromInit(collection_address: Address, item_index: bigint) {
    const init = await NftItem_init(collection_address, item_index);
    const address = contractAddress(0, init);
    return new NftItem(address, init);
  }

  static fromAddress(address: Address) {
    return new NftItem(address);
  }

  readonly address: Address;
  readonly init?: { code: Cell; data: Cell };
  readonly abi: ContractABI = {
    types: NftItem_types,
    getters: NftItem_getters,
    receivers: NftItem_receivers,
    errors: NftItem_errors,
  };

  private constructor(address: Address, init?: { code: Cell; data: Cell }) {
    this.address = address;
    this.init = init;
  }

  async send(
    provider: ContractProvider,
    via: Sender,
    args: { value: bigint; bounce?: boolean | null | undefined },
    message: Transfer | GetStaticData | "update" | UpdateCollectionContent
  ) {
    let body: Cell | null = null;
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "Transfer"
    ) {
      body = beginCell().store(storeTransfer(message)).endCell();
    }
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "GetStaticData"
    ) {
      body = beginCell().store(storeGetStaticData(message)).endCell();
    }
    if (message === "update") {
      body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
    }
    if (
      message &&
      typeof message === "object" &&
      !(message instanceof Slice) &&
      message.$$type === "UpdateCollectionContent"
    ) {
      body = beginCell().store(storeUpdateCollectionContent(message)).endCell();
    }
    if (body === null) {
      throw new Error("Invalid message type");
    }

    await provider.internal(via, { ...args, body: body });
  }

  async getGetNftData(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get("get_nft_data", builder.build())).stack;
    const result = loadTupleGetNftData(source);
    return result;
  }

  async getGetCollectionAddress(provider: ContractProvider) {
    let builder = new TupleBuilder();
    let source = (await provider.get("get_collection_address", builder.build()))
      .stack;
    let result = source.readAddress();
    return result;
  }
}

import { Fragment, Dispatch, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { LuChevronsUpDown } from "react-icons/lu";

type Option = {
  name: string;
  value: string;
};

interface Props {
  selectedLanguage: Option;
  languages: Option[];
  setSelectedLanguage: Dispatch<SetStateAction<Option>>;
}

const LanguageSelector: React.FC<Props> = ({
  selectedLanguage,
  languages,
  setSelectedLanguage,
}) => {
  return (
    <div className="flex items-center justify-center">
      <Listbox value={selectedLanguage} onChange={setSelectedLanguage}>
        <div className="relative mt-1">
          <Listbox.Button className="relativecursor-default rounded-lg bg-white py-2 pl-3 w-[130px] text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selectedLanguage.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <LuChevronsUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {languages.map((lang, langIdx) => (
                <Listbox.Option
                  key={langIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={lang}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {lang.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#FF4081]">
                          <IoCheckmarkCircleOutline
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default LanguageSelector;

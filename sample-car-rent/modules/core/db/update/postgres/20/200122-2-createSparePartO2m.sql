alter table SCR_SPARE_PART_O2M add constraint FK_SCR_SPARE_PART_O2M_SPARE_PART foreign key (SPARE_PART_ID) references SCR_SPARE_PART(ID);
create index IDX_SCR_SPARE_PART_O2M_SPARE_PART on SCR_SPARE_PART_O2M (SPARE_PART_ID);

FactoryBot.define do
    factory :user do
        email { Faker::Internet.email }
        firstname { Faker::Name.first_name }
        lastname { Faker::Name.last_name }
        password { Faker::Alphanumeric.alpha(number: 10) }
    end
end